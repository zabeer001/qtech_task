<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Helpers\HelperMethods;
use App\Models\Service;
use Symfony\Component\HttpFoundation\Response;

class ServiceController extends Controller
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

            $categories = $query->paginate($paginate_count);

            return response()->json([
                'success' => true,
                'data' => $categories,
                'current_page' => $categories->currentPage(),
                'total_pages' => $categories->lastPage(),
                'per_page' => $categories->perPage(),
                'total' => $categories->total(),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return HelperMethods::handleException($e, 'Failed to fetch categories.');
        }
    }

}
