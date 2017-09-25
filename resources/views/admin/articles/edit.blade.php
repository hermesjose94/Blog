@extends('admin.template.main')

@section('title','Crear Articulo '.$article->title)

@section('content')
  <div class="panel panel-default">
    <div class="panel-heading">
         Editar Articulo {{$article->title}}
    </div>
    <div class="panel-body">
      <div class="row">
          <div class="col-md-12">
              @include('admin.template.partials.errors')
              {!! Form::open(['route'=>['articles.update',$article],'method'=> 'PUT','files'=> true]) !!}

                  <div class="row">
                    <div class="col-sm-6 col-md-4">
                      <div class="thumbnail">
                        @foreach($article->images as $image)
                          <img src="{{ asset('images/articles/' . $image->name) }}" alt="{{$image->name}}">
                        @endforeach
                        <div class="caption">
                          <h3>{{$article->title}}</h3>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    {!! Form::label('title','Titulo') !!}
                    {!! Form::text('title',$article->title,['class'=>'form-control','placeholder'=>'Titulo del Articulo','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('image','Imagen') !!}
                    {!! Form::file('image',['id'=>'images']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('category_id','Categoria') !!}
                    {!! Form::select('category_id',$categories,$article->category->id,['class'=>'form-control select-chosen','placeholder'=>'Seleccione una opcion','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('content','Contenido') !!}
                    {!! Form::textarea('content',$article->content,['class'=>'form-control textarea-content','required']) !!}
                  </div>

                  <div class="form-group">
                    {!! Form::label('tags','Tags') !!}
                    {!! Form::select('tags[]',$tags,$my_tags,['class'=>'form-control select-mul-chosen','multiple']) !!}
                  </div>


                  <div class="form-group">
                    {!! Form::submit('Editar Articulo',['class'=>'btn btn-primary']) !!}
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
