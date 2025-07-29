<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\HelperMethods;
use App\Models\Booking;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class BookingController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth:api', 'admin'])->only(['store', 'update', 'destroy']);
    }

    protected array $typeOfFields = ['textFields'];

    protected array $textFields = [
        'service_id',
        'booking_date',
        'status',
        'payment_status',
    ];

    protected function validateRequest(Request $request)
    {
        return $request->validate([
            'service_id'     => 'required|integer|exists:services,id',
            'booking_date'   => 'required',
            'status'         => 'nullable|string',
            'payment_status' => 'nullable|string',
        ]);
    }

    /**
     * Display a listing of the bookings.
     */
    public function index(Request $request)
    {
        try {
            $validated = $request->validate([
                'paginate_count'      => 'nullable|integer|min:1',
                'search'              => 'nullable|string|max:255',
                'filter_with_service' => 'nullable|string|max:255',
                'status'              => 'nullable|string',
                'payment_status'      => 'nullable|string',
            ]);

            $search = $validated['search'] ?? null;
            $paginate_count = $validated['paginate_count'] ?? 10;
            $filterWithService = $validated['filter_with_service'] ?? null;
            $status = $validated['status'] ?? null;
            $paymentStatus = $validated['payment_status'] ?? null;

            $query = Booking::with(['service:id,name'])->orderBy('updated_at', 'desc');

            // Filter by uniq_id
            if ($search) {
                $query->where('uniq_id', 'like', $search . '%');
            }

            // Filter by service name
            if ($filterWithService) {
                $query->whereHas('service', function ($q) use ($filterWithService) {
                    $q->where('name', 'like', $filterWithService . '%');
                });
            }

            // Filter by booking status
            if ($status) {
                $query->where('status', $status);
            }

            // Filter by payment status
            if ($paymentStatus) {
                $query->where('payment_status', $paymentStatus);
            }

            $data = $query->paginate($paginate_count);

            return response()->json([
                'success'       => true,
                'data'          => $data,
                'current_page'  => $data->currentPage(),
                'total_pages'   => $data->lastPage(),
                'per_page'      => $data->perPage(),
                'total'         => $data->total(),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to fetch data.');
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $this->validateRequest($request);

            $user = null;
            try {
                if (JWTAuth::getToken()) {
                    $user = JWTAuth::parseToken()->authenticate();
                }
            } catch (JWTException $e) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token is invalid or expired.',
                ], Response::HTTP_UNAUTHORIZED);
            }

            $data = new Booking();

            HelperMethods::populateModelFields(
                $data,
                $request,
                $validated,
                $this->typeOfFields,
                [
                    'textFields' => $this->textFields,
                ]
            );



            $data->uniq_id = HelperMethods::generateUniqueId();
            $data->user_id = $user->id; // Set user_id if authenticated

            $data->save();

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully.',
                'data' => $data,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to create booking.');
        }
    }

    public function show($uniq_id)
    {
        try {
            $booking = Booking::with('service')
                ->where('uniq_id', $uniq_id)
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => $booking,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Booking not found.');
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $this->validateRequest($request);

            $data = Booking::findOrFail($id);

            HelperMethods::populateModelFields(
                $data,
                $request,
                $validated,
                $this->typeOfFields,
                [
                    'textFields' => $this->textFields,
                ]
            );

            $data->save();

            return response()->json([
                'success' => true,
                'message' => 'Booking updated successfully.',
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to update booking.');
        }
    }

    public function destroy($id)
    {
        try {
            $data = Booking::findOrFail($id);
            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'Booking deleted successfully',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to delete booking.');
        }
    }
}
