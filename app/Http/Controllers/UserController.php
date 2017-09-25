<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;
use App\Http\Requests\UserRequest;
use Auth;

class UserController extends Controller
{

    public function index(){
        $users = User::orderBy('id','ASC')->paginate(5);
        return view('admin.users.index')->with('users',$users);
    }

    public function create(){
        return view('admin.users.create');
    }

    public function register(){
        return view('admin.auth.register');
    }

    public function store(Request $request){
        $this->validate($request, [
          'name' => 'required|min:4|max:120',
          'email' => 'required|unique:users|max:255',
          'password' => 'min:4|max:120|required',
        ]);
        $user = new User($request->all());
        $user->type =$request->type;
        if ($user->type=="admin") {
          $user->avatar= "admin.png";
        }
        $user->password =bcrypt( $request->password);
        $user->save();
        flash('Usuario '. $user->name.', Creado con exito')->success()->important();
        return redirect()->route('users.index');
    }

    public function StoreRegister(Request $request){
        $this->validate($request, [
          'name' => 'required|min:4|max:120',
          'email' => 'required|unique:users|max:255',
          'password' => 'min:4|max:120|required|same:password_confirmation',
          'password_confirmation' => 'min:4|max:120|required'
        ]);
        $user = new User($request->all());
        if ($request->file('image')) {

          $file = $request->file('image');
          $name = 'web_' . time() . '.' . $file->getClientOriginalExtension();
          $path = public_path() . '/images/avatar/';
          $file->move($path,$name);
          $user->avatar = $name;
        }
        $user->password =bcrypt( $request->password);
        $user->save();

        //Flash por defecto
        //$request->session()->flash('mensaje', 'Usuario '. $user->name.', Creado Con exito');
        //return redirect()->route('users.index');
        //Flash laracast
        flash('Usuario '. $user->name.', Creado con exito')->success()->important();
        return redirect()->route('admin.auth.login');
    }

    public function edit($id){
        $user = User::find($id);
        return view('admin.users.edit')->with('user',$user);
    }

    public function update(Request $request, $id){
        $this->validate($request, [
          'name' => 'required|min:4|max:120',
          'email' => 'unique:users|max:255',
        ]);
        $user = User::find($id);
        if ($request->file('image')) {
          if ($user->avatar != "avatar.png") {
            $path = public_path() . '/images/avatar/'. $user->avatar;
            unlink($path);
          }

          $file = $request->file('image');
          $name = 'web_' . time() . '.' . $file->getClientOriginalExtension();
          $path = public_path() . '/images/avatar/';
          $file->move($path,$name);
          $user->avatar = $name;
        }
        $user->fill($request->all());
        $user->type=$request->type;
        if ($user->type=="member" && $user->avatar=="admin.png") {
          $user->avatar="avatar.png";
        }
        if ($user->type=="admin" && $user->avatar=="avatar.png") {
          $user->avatar="admin.png";
        }
        $user->save();
        flash('Usuario '. $user->name.', Editado con exito')->success()->important();
        return redirect()->route('users.index');
    }

    public function editP(){
        $user =Auth::user();
        return view('admin.users.profile')->with('user',$user);
    }

    public function updateP(Request $request){
        $this->validate($request, [
          'name' => 'required|min:4|max:120',
          'email' => 'unique:users|max:255',
          'password' => 'min:4|same:password_confirmation|nullable',
          'password_confirmation' => 'nullable|min:4'
        ]);
        //Manipulacion de imagenes
        $user = Auth::user();
        if ($request->file('image')) {
          if ($user->avatar != "avatar.png") {
            $path = public_path() . '/images/avatar/'. $user->avatar;
            unlink($path);
          }
          $file = $request->file('image');
          $name = 'web_' . time() . '.' . $file->getClientOriginalExtension();
          $path = public_path() . '/images/avatar/';
          $file->move($path,$name);
          $user->avatar = $name;
        }
        if ($request->name) {
          $user->name=$request->name;
        }
        if ($request->email) {
          $user->email=$request->email;
        }
        if ($request->password) {
          $user->password=$request->password;
        }
        $user->save();
        return redirect()->route('admin.index');
    }

    public function destroy($id){
        $user = User::find($id);
        $user->delete();
        flash('Usuario '. $user->name.', Eliminado con exito')->error()->important();
        return redirect()->route('users.index');
    }
}
