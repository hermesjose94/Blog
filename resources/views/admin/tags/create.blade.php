@extends('admin.template.main')

@section('title','Crear Tags')

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Crear Tags
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>'tags.store','method'=> 'POST']) !!}

                  <div class="form-group">
                    {!! Form::label('name','Nombre') !!}
                    {!! Form::text('name',null,['class'=>'form-control','placeholder'=>'Nombre del Tag','required']) !!}
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
