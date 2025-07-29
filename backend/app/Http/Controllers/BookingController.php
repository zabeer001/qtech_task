<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\HelperMethods;
use App\Models\Booking;

use Symfony\Component\HttpFoundation\Response;

class BookingController extends Controller
{
    public function __construct()
    {
        // Apply JWT authentication and admin middleware only to store, update, and destroy methods
        $this->middleware(['auth:api', 'admin'])->only(['store', 'update']);
    }
    protected array $typeOfFields = ['textFields', 'imageFields'];

    protected array $textFields = [
        'name',
        'description',
        'price',
        'status',
    ];



    /**
     * Validate the request data for category creation or update.
     *
     * @param Request $request
     * @return array
     */
    protected function validateRequest(Request $request)
    {
        return $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
        ]);
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Validate request parameters
            $validated = $request->validate([
                'paginate_count'     => 'nullable|integer|min:1',
                'search'             => 'nullable|string|max:255',
                'filter_with_service' => 'nullable|string|max:255', // New filter
            ]);

            $search = $validated['search'] ?? null;
            $paginate_count = $validated['paginate_count'] ?? 10;
            $filterWithService = $validated['filter_with_service'] ?? null;

            // Query with service relationship
            $query = Booking::with(['service:id,name'])->orderBy('updated_at', 'desc');

            // Filter by booking name (search)
            if ($search) {
                $query->where('name', 'like', $search . '%');
            }

            // Filter by service name
            if ($filterWithService) {
                $query->whereHas('service', function ($q) use ($filterWithService) {
                    $q->where('name', 'like', $filterWithService . '%');
                });
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
}
