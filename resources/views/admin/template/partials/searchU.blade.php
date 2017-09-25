fantastico y revisando varias paginas he construido el mutiscope que buscaba para los usuarios (no uso Laravel Collective sorry estoy haciendo el curso sin añadir nada al core de Laravel 5.2 y me va saliendo por eso vais a ver un formulario html tal cual).

En el users/index.blade.php :

<form class="navbar-form pull right" action="{{ route('admin.users.index') }}" method="get">
  <div class="form-group">
    <div class="input-group">
      <span class="input-group-addon" id="buscador"><span class="glyphicon glyphicon-search" aria-hidden="true"></span></span>
      <div class="input-group-btn">
        <input class="form-control" type="text" name="name" placeholder="Buscar nombre?" aria-describedby="buscador">
        <input class="form-control" type="text" name="email" placeholder="Buscar correo?" aria-describedby="buscador">
        <input class="form-control" type="text" name="type" placeholder="Buscar tipo?" aria-describedby="buscador">
        <button type="submit" class="btn btn-info">Buscar</button>
      </div>
    </div>
  </div>
</form>

En el User.php :

    public function scopeSearch($query, $data){
      $name= $data->name;
      $email= $data->email;
      $type= $data->type;
      return $query->where('name', 'LIKE', "%$name%")> where('email', 'LIKE', "%$email%")> where('type', 'LIKE', "%$type%");
    }

Y para el UsersController :

    public function index(Request $request)
    {
      $users= User::search($request)>orderBy('id', 'ASC')>paginate(8);
      return view('admin.users.index')->with('users', $users);
    }

lo único que no se es si se pueden usar las variables de un formulario sin mas... sin añadir seguridad o si ya laravel añade realscapestrings o htmlentities... soy bastante nood jeje.

Probado y funcionando. Carlos, el curso esta siendo fantastico!! gracias por tanta inspiración.﻿
