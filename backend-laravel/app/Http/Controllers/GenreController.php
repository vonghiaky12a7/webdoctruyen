<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    public function index()
    {
        $genres = Genre::select('genreId', 'genreName')->get();

        return response()->json($genres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'genreName' => 'required|string|unique:genres,genreName',
        ]);

        $genre = Genre::create([
            'genreName' => $request->genreName,
        ]);

        return response()->json([
            'genreId' => $genre->genreId,
            'genreName' => $genre->genreName,
        ], 201);
    }

    public function show($genreId)
    {
        $genre = Genre::select('genreId', 'genreName')
            ->where('genreId', $genreId)
            ->firstOrFail();

        return response()->json($genre);
    }

    public function update(Request $request, $genreId)
    {
        $genre = Genre::where('genreId', $genreId)->firstOrFail();

        $request->validate([
            'genreName' => 'required|string|unique:genres,genreName,' . $genreId . ',genreId',
        ]);

        $genre->genreName = $request->genreName;
        $genre->save();

        return response()->json([
            'genreId' => $genre->genreId,
            'genreName' => $genre->genreName,
        ]);
    }

    public function destroy($genreId)
    {
        $genre = Genre::where('genreId', $genreId)->firstOrFail();
        $genre->delete();

        return response()->json(['message' => 'Genre deleted successfully']);
    }
}
