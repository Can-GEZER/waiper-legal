// Calculators under /araclar/. Everything runs in the browser; nothing is sent anywhere.
(function () {
  var fmt = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });

  function num(el) {
    // "45.000", "45000" and "45.000,50" all mean the same thing here
    var v = (el && el.value ? el.value : "").replace(/\./g, "").replace(",", ".").replace(/[^\d.]/g, "");
    var n = parseFloat(v);
    return isFinite(n) ? n : 0;
  }

  function tl(n) {
    return fmt.format(Math.round(n)) + " TL";
  }

  function byId(id) {
    return document.getElementById(id);
  }

  // ---- Harcanabilir tutar ----
  var spendable = byId("calc-spendable");
  if (spendable) {
    var value = byId("sonuc-tutar");
    var sub = byId("sonuc-gunluk");

    var update = function () {
      var income = num(byId("gelir"));
      var result = income - num(byId("duzenli")) - num(byId("taksit")) - num(byId("harcanan"));
      var days = Math.floor(num(byId("gun")));

      value.classList.remove("negative", "idle");
      if (income <= 0) {
        value.textContent = "0 TL";
        value.classList.add("idle");
        sub.textContent = "Hesap için aylık gelirini gir.";
        return;
      }
      value.textContent = tl(result);
      if (result < 0) {
        value.classList.add("negative");
        sub.textContent = "Bu ay gelirini " + tl(-result) + " aştın.";
      } else if (days > 0) {
        sub.textContent = "Günde yaklaşık " + tl(result / days) + ", " + days + " gün kaldı.";
      } else {
        sub.textContent = "Günlük payı görmek için maaşa kalan gün sayısını gir.";
      }
    };

    spendable.addEventListener("input", update);
    update();
  }

  // ---- Taksit yükü ----
  var installments = byId("calc-installments");
  if (installments) {
    var rows = byId("taksit-satirlari");
    var template = byId("taksit-satiri");
    var out = byId("sonuc-tablo");
    var summary = byId("sonuc-ozet");
    var MONTHS = 6;
    var monthName = new Intl.DateTimeFormat("tr-TR", { month: "long", year: "numeric" });

    var addRow = function () {
      rows.appendChild(template.content.cloneNode(true));
    };

    var render = function () {
      var totals = [];
      for (var m = 0; m < MONTHS; m++) totals.push(0);
      var any = false;

      rows.querySelectorAll(".row").forEach(function (row) {
        var monthly = num(row.querySelector("[data-aylik]"));
        var left = Math.floor(num(row.querySelector("[data-kalan]")));
        if (monthly <= 0 || left <= 0) return;
        any = true;
        for (var m = 0; m < MONTHS && m < left; m++) totals[m] += monthly;
      });

      out.textContent = "";
      if (!any) {
        summary.textContent = "Tabloyu görmek için en az bir taksitin aylık tutarını ve kalan taksit sayısını gir.";
        return;
      }

      var now = new Date();
      var peak = 0;
      totals.forEach(function (total, m) {
        if (total > totals[peak]) peak = m;
        var tr = document.createElement("tr");
        var name = document.createElement("td");
        name.textContent = monthName.format(new Date(now.getFullYear(), now.getMonth() + 1 + m, 1));
        var amount = document.createElement("td");
        amount.className = "num";
        amount.textContent = tl(total);
        tr.appendChild(name);
        tr.appendChild(amount);
        out.appendChild(tr);
      });

      var text = "En yüklü ay: " + out.children[peak].firstChild.textContent + ", " + tl(totals[peak]) + ".";
      var income = num(byId("gelir"));
      if (income > 0) {
        text += " Gelirine oranı: yaklaşık %" + Math.round((totals[peak] / income) * 100) + ".";
      }
      summary.textContent = text;
    };

    byId("taksit-ekle").addEventListener("click", function () {
      addRow();
      render();
    });
    installments.addEventListener("click", function (e) {
      var btn = e.target.closest(".remove");
      if (!btn) return;
      btn.closest(".row").remove();
      if (!rows.querySelector(".row")) addRow();
      render();
    });
    installments.addEventListener("input", render);

    addRow();
    addRow();
    render();
  }
})();
