@extends('admin.template.main')

@section('title','Editar Tag '. $tag->name)

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Crear Tags {{$tag->name}}
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>['tags.update',$tag],'method'=> 'PUT']) !!}

                  <div class="form-group">
                    {!! Form::label('name','Nombre') !!}
                    {!! Form::text('name',$tag->name,['class'=>'form-control','placeholder'=>'Nombre del Tag','required']) !!}
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
