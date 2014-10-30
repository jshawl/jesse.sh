---
layout: post
---

I was working on a rails application that responded with the following JSON:

{% highlight js%}
[
 { 
   "id":14,
   "title":"post title",
   "description":"my awesome description",
   "user_id":1,
   "created_at":"2014-10-29T02:50:01.707Z",
   "updated_at":"2014-10-29T02:51:38.481Z"
  }
]
{% endhighlight %}

Even though I have access to the `user_id` attribute of this post, I wanted to be able to show the user name or email without having to make another HTTP request.

To add a new attribute to this JSON, I needed to add a few methods to extend `ActiveRecord::Base`'s `as_json` method.

{% highlight ruby %}
class Post < ActiveRecord::Base

  belongs_to :user

  def as_json(options={})
      super.as_json(options).merge({user_email: get_user_email})
  end

  def get_user_email
    self.user && self.user.email
  end

end
{% endhighlight %}

The `super.as_json(`... adds whatever attributes you specify for each one of the records from your model.

Since these methods are in the `Post` class, we can access the current post with `self`.

If there is no user for a given post, `self.user.email` would throw an undefined method for `nil:NilClass`,
so I prepend that with `self.user &&` to make sure the user exists first.

{% highlight js%}
[
 { 
   "id":14,
   "title":"post title",
   "description":"my awesome description",
   "user_id":1,
   "created_at":"2014-10-29T02:50:01.707Z",
   "updated_at":"2014-10-29T02:51:38.481Z",
   "user_email":"jesse@jshawl.com"
  }
]
{% endhighlight %}
