@extends('admin.template.main')

@section('title','Crear Categorias')

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Crear Categorias
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>'categories.store','method'=> 'POST']) !!}

                  <div class="form-group">
                    {!! Form::label('name','Nombre') !!}
                    {!! Form::text('name',null,['class'=>'form-control','placeholder'=>'Nombre de la categoria','required']) !!}
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
