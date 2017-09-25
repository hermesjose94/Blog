@extends('front.template.main')

@section('title',$article->title)

@section('content')

<div class="content_page container">
  <div class="information">
    <div class="contenedor">
      <div class="post">
        <div class="img_post single">
          @foreach($article->images as $image)
            <img src="{{ asset('images/articles/' . $image->name) }}" alt="">
          @endforeach
        </div>
        <hgroup class="post_content">
          <div class="post_line"></div>
          <div class="the_content">
            {!! $article->content !!}
          </div>
        </hgroup>
      </div>
      <div id="commentarios">
        <script id="dsq-count-scr" src="//blog-laravel-5-4.disqus.com/count.js" async></script>
        <div id="caja_comentarios">
          <div id="disqus_thread"></div>
            <script>
                /**
                 *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
                 *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables
                 */
                /*
                var disqus_config = function () {
                    this.page.url = PAGE_URL;  // Replace PAGE_URL with your page's canonical URL variable
                    this.page.identifier = PAGE_IDENTIFIER; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
                };

                (function() {  // DON'T EDIT BELOW THIS LINE
                    var d = document, s = d.createElement('script');

                    s.src = 'https://blog-laravel-5-4.disqus.com/embed.js';

                    s.setAttribute('data-timestamp', +new Date());
                    (d.head || d.body).appendChild(s);
                })();
                */
            </script>
        </div>
      </div>
    </div>
  </div>
  <div class="sidebar">
    @include('front.template.partials.aside')
  </div>
</div>

@endsection
