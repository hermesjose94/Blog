@extends('admin.template.main')

@section('title','Crear Articulo')

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Crear Articulo
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>'articles.store','method'=> 'POST','files'=> true]) !!}

                  <div class="form-group">
                    {!! Form::label('title','Titulo') !!}
                    {!! Form::text('title',null,['class'=>'form-control','placeholder'=>'Titulo del Articulo','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('category_id','Categoria') !!}
                    {!! Form::select('category_id',$categories,null,['class'=>'form-control select-chosen','placeholder'=>'Seleccione una opcion','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('content','Contenido') !!}
                    {!! Form::textarea('content',null,['class'=>'form-control textarea-content','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('tags','Tags') !!}
                    {!! Form::select('tags[]',$tags,null,['class'=>'form-control select-mul-chosen','multiple']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('image','Imagen') !!}
                    {!! Form::file('image',['id'=>'images','multiple']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::submit('Publicar',['class'=>'btn btn-primary']) !!}
                  </div>

              {!! Form::close() !!}
          </div>
      </div>
    </div>
  </div>
@endsection

@section('js')
<script>

  $('.select-mul-chosen').chosen({
    placeholder_text_multiple: 'Seleccione sus opciones'
  });

  $('.textarea-content').trumbowyg();
  $("#images").fileinput({
        showUpload: false,
        maxFileCount: 10,
        mainClass: "input-group-lg"
    });

</script>
@endsection
