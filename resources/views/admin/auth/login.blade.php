@extends('admin.template.main')

@section('title','Login')

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
        Iniciar Sesión
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>'admin.auth.login','method'=> 'POST']) !!}
              <div class="form-group">
                {!! Form::label('email','Correo Electronico') !!}
                {!! Form::email('email',null,['class'=>'form-control','placeholder'=>'example@gmail.com','required']) !!}
              </div>

              <div class="form-group">
                {!! Form::label('password','Contraseña') !!}
                {!! Form::password('password',['class'=>'form-control','placeholder'=>'*******','required']) !!}
              </div>

              <div class="form-group">
                {!! Form::submit('Acceder',['class'=>'btn btn-primary']) !!}
                <a href="{{ route('admin.auth.register') }}" class="btn btn-success">Resgistrar</a>
              </div>

              {!! Form::close() !!}
              <a href="{{ route('password.request') }}">¿Olvide mi contraseña?</a>
          </div>
      </div>
    </div>
  </div>
@endsection
