<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Helpers\HelperMethods;
use App\Models\Service;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends Controller
{
    public function __construct()
    {
        // Apply JWT authentication and admin middleware only to store, update, and destroy methods
        $this->middleware(['auth:api', 'admin'])->only(['store', 'update', 'destroy']);
    }

    protected array $typeOfFields = ['textFields'];

    protected array $textFields = [
        'name',
        'description',
        'price',
        'status',
    ];

    /**
     * Validate the request data for service creation or update.
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
     * Display a listing of the services.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $validated = $request->validate([
                'paginate_count' => 'nullable|integer|min:1',
                'search' => 'nullable|string|max:255',
            ]);

            $search = $validated['search'] ?? null;
            $paginate_count = $validated['paginate_count'] ?? 10;

            $query = Service::query();

            if ($search) {
                $query->where('name', 'like', $search . '%');
            }

            $services = $query->paginate($paginate_count);

            return response()->json([
                'success' => true,
                'data' => $services,
                'current_page' => $services->currentPage(),
                'total_pages' => $services->lastPage(),
                'per_page' => $services->perPage(),
                'total' => $services->total(),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to fetch services.');
        }
    }

    /**
     * Store a newly created service in storage.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $this->validateRequest($request);

            $data = new Service();

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
                'message' => 'Service created successfully.',
                'data' => $data,
            ], Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to create service.');
        }
    }

    /**
     * Display the specified service.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $service = Service::findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $service,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Service not found.');
        }
    }

    /**
     * Update the specified service in storage.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $validated = $this->validateRequest($request);

            $data = Service::findOrFail($id);

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
                'message' => 'Service updated successfully.',
                'data' => $data,
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to update service.');
        }
    }

    /**
     * Remove the specified service from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $data = Service::findOrFail($id);
            $data->delete();

            return response()->json([
                'success' => true,
                'message' => 'Service deleted successfully',
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to delete service.');
        }
    }
}
