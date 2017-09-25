<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*
GET,POST,PUT,DELETE,RESOURCE
*/


/*
|--------------------------------------------------------------------------
| Fronted
|--------------------------------------------------------------------------
*/

Route::get('/',[
  'uses' => 'FrontController@index',
  'as'   => 'front.index'
]);


Route::get('categories/{id}',[
  'uses' => 'FrontController@searchCategory',
  'as'   => 'front.search.category'
]);

Route::get('tags/{id}',[
  'uses' => 'FrontController@searchTag',
  'as'   => 'front.search.tag'
]);

Route::get('articles/{slug}',[
  'uses' => 'FrontController@viewArticle',
  'as'   => 'front.view.article'
]);
/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

Route::group(['prefix'=>'admin','middleware' =>'auth'],function(){

  Route::get('/',[
    'as'=>'admin.index',
    'uses' => 'AdminController@index',
  ]);

  Route::group(['middleware'=>'admin'],function(){
    Route::resource('users','UserController');
    Route::get('users/{id}/destroy',[
      'uses' => 'UserController@destroy',
      'as'   => 'admin.users.destroy'
    ]);
  });

  Route::get('profile',[
    'uses' => 'UserController@editP',
    'as'   => 'admin.profile'
  ]);
  Route::put('profile/update',[
    'uses' => 'UserController@updateP',
    'as'   => 'admin.profile.update'
  ]);

  Route::resource('categories','CategoriesController');
  Route::get('categories/{id}/destroy',[
    'uses' => 'CategoriesController@destroy',
    'as'   => 'admin.categories.destroy'
  ]);

  Route::resource('tags','TagsController');
  Route::get('tags/{id}/destroy',[
    'uses' => 'TagsController@destroy',
    'as'   => 'admin.tags.destroy'
  ]);

  Route::resource('articles','ArticlesController');
  Route::get('articles/{id}/destroy',[
    'uses' => 'ArticlesController@destroy',
    'as'   => 'admin.articles.destroy'
  ]);

});


/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

Route::get('admin/auth/login', [
    'uses'  => 'Auth\LoginController@showLoginForm',
    'as'    => 'admin.auth.login'
]);

Route::post('admin/auth/login', [
    'uses'  => 'Auth\LoginController@login',
    'as'    => 'admin.auth.login'
]);

Route::get('admin/auth/logout', [
    'uses'  => 'Auth\LoginController@logout',
    'as'    => 'admin.auth.logout'
]);

Route::get('admin/auth/register', [
    'uses'  => 'UserController@register',
    'as'    => 'admin.auth.register'
]);

Route::post('admin/auth/store', [
    'uses'  => 'UserController@StoreRegister',
    'as'    => 'admin.auth.store'
]);


Auth::routes();

//Route::get('/home', 'HomeController@index')->name('home');
/*
Route::get('profile', function () {
    // Only authenticated users may enter...
})->middleware('auth');
*/
