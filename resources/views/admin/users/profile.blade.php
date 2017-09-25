@extends('admin.template.main')

@section('title','Editar usuario ' .$user->name )

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Editando perdil de {{$user->name}}
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @if(count($errors) > 0)
                <div class="alert alert-danger" role="alert">
                    <ul>
                    @foreach($errors->all() as $error)
                      <li>{{ $error }}</li>
                    @endforeach
                    </ul>
                </div>
              @endif
              {!! Form::open(['route'=>['admin.profile.update',$user],'method'=> 'PUT','files'=> true]) !!}
                  <div class="row">
                    <div class="col-sm-6 col-md-4">
                      <div class="thumbnail">
                        <img src="{{ asset('images/avatar/' . $user->avatar) }}" alt="{{$user->name}}">
                        <div class="caption">
                          <h3>{{$user->name}}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    {!! Form::label('image','Avatar') !!}
                    {!! Form::file('image',['id'=>'images']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('name','Nombre') !!}
                    {!! Form::text('name',$user->name,['class'=>'form-control','placeholder'=>'Nombre completo','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('email','Correo Electronico') !!}
                    {!! Form::email('email',null,['class'=>'form-control','placeholder'=>''.$user->email]) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('password','Contraseña') !!}
                    <input type="password" name="password"  class="form-control" placeholder="*******">
                  </div>

                  <div class="form-group">
                    {!! Form::label('password_confirmation','Confirmar contraseña') !!}
                    {!! Form::password('password_confirmation',['class'=>'form-control','placeholder'=>'*******']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::submit('Editar',['class'=>'btn btn-primary']) !!}
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
