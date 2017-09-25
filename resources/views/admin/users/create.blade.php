@extends('admin.template.main')

@section('title','Crear Usuario')

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Crear Usuario
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>'users.store','method'=> 'POST']) !!}

                  <div class="form-group">
                    {!! Form::label('name','Nombre') !!}
                    {!! Form::text('name',null,['class'=>'form-control','placeholder'=>'Nombre completo','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('email','Correo Electronico') !!}
                    {!! Form::email('email',null,['class'=>'form-control','placeholder'=>'example@gmail.com','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('password','Contraseña') !!}
                    {!! Form::password('password',['class'=>'form-control','placeholder'=>'*******','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('type','Tipo') !!}
                    {!! Form::select('type',['member'=>'Miembro','admin'=>'Administrador'],null,['class'=>'form-control','placeholder' => 'Seleccione una opción...','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::submit('Registrar',['class'=>'btn btn-primary']) !!}
                  </div>

              {!! Form::close() !!}
          </div>
      </div>
    </div>
  </div>
@endsection
