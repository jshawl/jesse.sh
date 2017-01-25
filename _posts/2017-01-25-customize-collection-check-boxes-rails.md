---
layout: post
---

If you are using Rails' form helper [`collection_check_boxes`](http://apidock.com/rails/v4.0.2/ActionView/Helpers/FormOptionsHelper/collection_check_boxes), it's not entirely obvious how you might
go about customizing the label's html.

## The "Normal Way"

...or what frequently shows up in [the documentation](http://apidock.com/rails/v4.0.2/ActionView/Helpers/FormOptionsHelper/collection_check_boxes).

Say we have the following Ruby classes:

```rb
class Post < ActiveRecord::Base
  has_and_belongs_to_many :authors
end
class Author < ActiveRecord::Base
  has_and_belongs_to_many :posts
  def name_with_initial
    "#{first_name.first}. #{last_name}"
  end
end
```

The easiest way to create a group of checkboxes is with `collection_check_boxes`:

```erb
<!-- app/views/carts/new.html.erb -->
<%= collection_check_boxes(:post, :author_ids, Author.all, :id, :name_with_initial) %>
```

This generates the following HTML:

```html
<input id="post_author_ids_1" name="post[author_ids][]" type="checkbox" value="1" checked="checked" />
<label for="post_author_ids_1">D. Heinemeier Hansson</label>
<input id="post_author_ids_2" name="post[author_ids][]" type="checkbox" value="2" />
<label for="post_author_ids_2">D. Thomas</label>
<input id="post_author_ids_3" name="post[author_ids][]" type="checkbox" value="3" />
<label for="post_author_ids_3">M. Clark</label>
<input name="post[author_ids][]" type="hidden" value="" />
```

## The Not-so-normal Way

If you don't have access to the `Author` class, as was my case when working with
the Stripe API, you have two options.

### Add to the open ruby class

Opening a class definition on the class for which you don't have access allows you
to define new methods on a class:

```rb
class Author
  def name_with_initial
    # code accessing instance
  end
end
```

...or

### Pass a block to the form helper

```rb
collection_check_boxes(:post, :author_ids, Author.all, :id, :name_with_initial) do |b|
  b.check_box
  b.label do
    b.object.first_name.first + ". " + b.object.last_name
  end
end
```

Boom! The instance for each of the radio buttons is available on the `object` method
as seen above.
