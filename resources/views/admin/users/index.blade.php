@extends('admin.template.main')

@section('title','Lista Usuario')

@section('content')
  <div class="row">
      <div class="col-md-12">
          <!-- Advanced Tables -->
          <div class="panel panel-default">
              <div class="panel-heading">
                   Lista de Usarios
              </div>
              <div class="panel-body">
                  <div class="table-responsive">
                      <a href="{{ route('users.create') }}" class="btn btn-success">Registrar nuevo usuario</a>
                      <hr>
                      <table class="table table-striped table-bordered table-hover" id="dataTables-example">
                          <thead>
                              <tr>
                                  <th>ID</th>
                                  <th>Nombre</th>
                                  <th>Correo</th>
                                  <th>Tipo</th>
                                  <th>Acción</th>
                              </tr>
                          </thead>
                          <tbody>
                            @foreach($users as $user)
                              <tr class="odd gradeX">
                                  <td>{{$user->id}}</td>
                                  <td><img src="{{ asset('images/avatar/' . $user->avatar) }}" alt="" class="avatar">  {{$user->name}}</td>
                                  <td>{{$user->email}}</td>
                                  <td>
                                    @if($user->type == "admin")
                                      <span class="label label-danger">{{$user->type}}</span>
                                    @else
                                      <span class="label label-primary">{{$user->type}}</span>
                                    @endif
                                   </td>
                                  <td class="center"><a href="{{ route('users.edit', $user->id) }}" class="btn btn-warning"><i class="fa fa-pencil" aria-hidden="true"></i></a>  <a href="{{ route('admin.users.destroy', $user->id) }}" onclick="return confirm('¿Seguro que deseas eliminar?')" class="btn btn-danger"><i class="fa fa-trash-o" aria-hidden="true"></i></a></td>
                              </tr>
                            @endforeach
                          </tbody>
                      </table>
                      {!! $users->render() !!}
                  </div>
              </div>
          </div>
          <!--End Advanced Tables -->
      </div>
    </div>
@endsection
