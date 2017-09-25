<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Article;
use Carbon\Carbon;
use App\Category;
use App\Tag;

class FrontController extends Controller
{
    public function __construct()
    {
      Carbon::setLocale('es');
    }
    public function index()
    {
        $articles = Article::orderBy('id','DESC')->paginate(4);
        $articles->each(function($articles){
          $articles->category;
          $articles->images;
        });
        return view('front.template.index')
              ->with('articles',$articles);
    }
    public function searchCategory($id)
    {

      $category = Category::find($id);
      $articles =$category->articles()->paginate(4);
      $articles->each(function($articles){
        $articles->category;
        $articles->images;
      });
      return view('front.template.index')
            ->with('articles',$articles);
    }

    public function searchTag($id)
    {

      $tag = Tag::find($id);

      $articles =$tag->articles()->paginate(4);
      $articles->each(function($articles){
        $articles->category;
        $articles->images;
      });
      return view('front.template.index')
            ->with('articles',$articles);
    }

    public function viewArticle($slug)
    {
      $article = Article::where('slug', $slug)->firstOrFail();
      $article->category;
      $article->user;
      $article->tags;
      $article->images;
      return view('front.template.article')->with('article',$article);
    }

}
