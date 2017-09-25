@extends('admin.template.main')

@section('title','Registrar Usuario')

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Registrar Usuario
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>'admin.auth.store','method'=> 'POST','files'=> true]) !!}

                  <div class="form-group">
                    {!! Form::label('name','Nombre') !!}
                    {!! Form::text('name',null,['class'=>'form-control','placeholder'=>'Nombre completo','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('image','Avatar') !!}
                    {!! Form::file('image',['id'=>'images']) !!}
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
                    {!! Form::label('password_confirmation','Confirmar contraseña') !!}
                    {!! Form::password('password_confirmation',['class'=>'form-control','placeholder'=>'*******']) !!}
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

@section('js')
<script>

  $("#images").fileinput({
        showUpload: false,
        maxFileCount: 10,
        mainClass: "input-group-lg"
    });

</script>
@endsection
