<section class="widget">
  <h3>{{ trans('app.title_categories') }}</h3>
  <div class="cat">
    @foreach($categories as $category)
    <div class="item">
      <a href="{{ route('front.search.category',$category->id) }}">{{ $category->name }}</a>
      <span>{{ $category->articles->count() }}</span>
    </div>
    @endforeach
  </div>
</section>
<section class="widget">
  <h3>{{ trans('app.title_tags') }}</h3>
  <ul>
    @foreach ($tags as $tag)
      <li class="cat-item"><a href="{{ route('front.search.tag',$tag->id) }}">{{ $tag->name }}</a></li>
    @endforeach
  </ul>
</section>
