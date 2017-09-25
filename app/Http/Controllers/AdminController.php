<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;
use Carbon\Carbon;
use App\Category;
use App\Tag;
use App\User;

class AdminController extends Controller
{
  public function __construct()
  {
    Carbon::setLocale('es');
  }
  public function index()
  {
    $categories = Category::orderBy('name','ASC');
    $articles   = Article::orderBy('id','DESC');
    $users      = User::orderBy('name','ASC');
    $tags       = Tag::orderBy('name','ASC');
    $Larticles  = $articles->take(6)->get();

    return view('admin.template.home')
        ->with('categories',$categories)
        ->with('articles',$articles)
        ->with('Larticles',$Larticles)
        ->with('users',$users)
        ->with('tags',$tags);
  }
}
