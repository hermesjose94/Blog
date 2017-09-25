@extends('admin.template.main')

@section('title','Editar Categoria '.$category->name)

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Editar Categoria {{$category->name}}
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>['categories.update',$category],'method'=> 'PUT']) !!}

                  <div class="form-group">
                    {!! Form::label('name','Nombre') !!}
                    {!! Form::text('name',$category->name,['class'=>'form-control','placeholder'=>'Nombre de la categoria','required']) !!}
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
