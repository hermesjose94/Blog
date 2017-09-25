@extends('front.template.main')

@section('title',trans('app.title_last_articles'))

@section('content')
<div class="content_page container">
  <div class="information">
    <div class="contenedor">
      @foreach($articles as $article)
      <article class="contenedor_tarjeta">
        <a href="{{ route('front.view.article',$article->slug) }}">
          <figure>
            <div class="frontal box">
                @foreach($article->images as $image)
                <img src="{{ asset('images/articles/' . $image->name) }}" alt="">
                @endforeach
                <div class="titulo">
                  <h2>{{ $article->title }}</h2>
                  <div class="extra">
                    <div class="cont">
                      <i class="fa fa-folder-open "></i><span>{{ $article->category->name }}</span>
                    </div>
                    <div class="cont">
                      <i class="fa fa-clock-o "></i><span>{{ $article->created_at->diffForHumans() }}</span>
                    </div>
                  </div>
                </div>
            </div>
            <figcaption class="trasera">
              <h2 class="titulo">{{ $article->title }}</h2>
              <hr>
              <p>{{ str_limit(strip_tags($article->content), 200) }}</p>
            </figcaption>
          </figure>
        </a>
      </article>
      @endforeach
    </div>
    <div class="pagination">
      {!! $articles->render() !!}
    </div>
  </div>
  <div class="sidebar">
    @include('front.template.partials.aside')
  </div>
</div>

@endsection
