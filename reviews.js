// Play reviews picked in the admin panel (Firestore publicReviews). Fetched through the
// /api/reviews proxy in _redirects, so the browser only talks to this site. The sections stay
// hidden while the list is empty or the request fails.
(function () {
  var MAX = 6;

  function field(doc, name) {
    var v = (doc.fields || {})[name] || {};
    return v.stringValue !== undefined ? v.stringValue : Number(v.integerValue || v.doubleValue || 0);
  }

  function card(review) {
    var el = document.createElement("figure");
    el.className = "review-card";
    var rating = document.createElement("div");
    rating.className = "review-rating";
    rating.setAttribute("role", "img");
    rating.setAttribute("aria-label", review.rating + " / 5");
    for (var i = 1; i <= 5; i++) {
      var dot = document.createElement("span");
      if (i <= review.rating) dot.className = "on";
      rating.appendChild(dot);
    }
    var text = document.createElement("blockquote");
    text.textContent = review.text;
    el.appendChild(rating);
    el.appendChild(text);
    if (review.author) {
      var author = document.createElement("figcaption");
      author.textContent = review.author;
      el.appendChild(author);
    }
    return el;
  }

  fetch("/api/reviews")
    .then(function (res) { return res.ok ? res.json() : {}; })
    .then(function (data) {
      var reviews = (data.documents || [])
        .map(function (doc) {
          return {
            rating: field(doc, "rating"),
            text: String(field(doc, "text")),
            author: String(field(doc, "author") || ""),
            publishedAt: field(doc, "publishedAt"),
          };
        })
        .filter(function (r) { return r.text && r.rating >= 1; })
        .sort(function (a, b) { return b.publishedAt - a.publishedAt; })
        .slice(0, MAX);
      if (!reviews.length) return;
      document.querySelectorAll("[data-reviews]").forEach(function (section) {
        var list = section.querySelector(".reviews");
        reviews.forEach(function (r) { list.appendChild(card(r)); });
        section.hidden = false;
      });
    })
    .catch(function () { /* section stays hidden */ });
})();
