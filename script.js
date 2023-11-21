$(document).ready(function () {
  var itemQuantity = {};
  var itemPrices = {};

  function hitungTotalSetelahPajak(totalSebelumPajak) {
    var pajak = totalSebelumPajak * 0.1;
    var totalSetelahPajak = totalSebelumPajak + pajak;
    return {
      pajak: pajak,
      totalSetelahPajak: totalSetelahPajak,
    };
  }

  function updateTotal(total) {
    $("#totalPrice").text(total.toLocaleString("id-ID"));
  }

  function updatePajak(pajak) {
    $("#taxDiscount").text(pajak.toLocaleString("id-ID"));
  }

  function updateTotalAmount(totalAmount) {
    $("#totalAmount").text("Rp. " + totalAmount.toLocaleString("id-ID"));
  }

  function updateTotalAfterQuantityChange() {
    var totalPrice = 0;
    for (var item in itemQuantity) {
      totalPrice += itemPrices[item] * itemQuantity[item];
    }

    var { pajak, totalSetelahPajak } = hitungTotalSetelahPajak(totalPrice);
    updateTotal(totalPrice);
    updatePajak(pajak);
    updateTotalAmount(totalSetelahPajak);
  }

  $(".iconplus").on("click", function () {
    var $clickedItem = $(this).closest(".isi");
    var itemName = $clickedItem.find("p").first().text().trim();
    var itemPriceText = $clickedItem.find("h1").text().trim();
    var itemPrice = parseFloat(
      itemPriceText.replace("Rp. ", "").replace(".", "").replace(",", ".")
    );

    if (!isNaN(itemPrice)) {
      var formattedItemName = itemName.replace(/\s+/g, "_").toLowerCase();

      if (!itemQuantity[formattedItemName]) {
        itemQuantity[formattedItemName] = 1;
        itemPrices[formattedItemName] = itemPrice;
      } else {
        itemQuantity[formattedItemName]++;
      }

      var isItemExist =
        $(".belanja .barang .detail-kiri p").filter(function () {
          return $(this).text().includes(itemName);
        }).length > 0;

      if (!isItemExist) {
        var newElement = `
                <div class="barang">
                    <div class="detail-kiri">
                        <p>${itemName} - <span id="stock_${formattedItemName}">${itemQuantity[formattedItemName]}</span></p>
                        <p class="normal">Harga: ${itemPriceText}</p>
                    </div>
                    <button class="remove">
                        <span class="material-symbols-outlined">delete</span>
                    </button>
                </div>
            `;

        $(".belanja").append(newElement);
        updateTotalAfterQuantityChange();
      } else {
        $("#stock_" + formattedItemName).text(itemQuantity[formattedItemName]);
        updateTotalAfterQuantityChange();
      }
    } else {
      console.error("Harga item tidak valid");
    }
  });

  $(".add_icon2").on("click", "#iconminus", function () {
    var $item = $(this).closest(".barang");
    var itemNameElement = $item.find(".detail-kiri p").first();
    var itemName = itemNameElement.text().trim();
    var itemPriceText = $item.find(".detail-kiri .normal").text().trim();
    var itemPrice = parseFloat(
      itemPriceText
        .replace("Unit Price: Rp. ", "")
        .replace(".", "")
        .replace(",", ".")
    );

    if (!isNaN(itemPrice)) {
      var totalPriceText = $("#totalPrice").text().trim();
      var currentTotal =
        parseFloat(
          totalPriceText.replace("Rp. ", "").replace(".", "").replace(",", ".")
        ) || 0;

      var quantityElement = $(
        "#stock_" + itemName.replace(/\s+/g, "_").toLowerCase()
      );
      var currentQuantity = parseInt(quantityElement.text());

      if (currentQuantity > 1) {
        currentQuantity--;
        quantityElement.text(currentQuantity);
        itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()]--;
        updateTotalAfterQuantityChange();
      } else {
        delete itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()];
        $item.remove();
        $(this).find("#iconminus").hide();
        updateTotalAfterQuantityChange();
      }
    } else {
      console.error("Harga item tidak valid");
    }
  });

  $(".belanja").on("click", ".remove", function () {
    var $item = $(this).closest(".barang");
    var itemNameElement = $item.find(".detail-kiri p").first();
    var itemName = itemNameElement.text().split(" - ")[0].trim();
    var itemPriceText = $item.find(".detail-kiri .normal").text().trim();
    var itemPrice = parseFloat(
      itemPriceText
        .replace("Harga: Rp. ", "")
        .replace(".", "")
        .replace(",", ".")
    );

    if (!isNaN(itemPrice)) {
      var totalPriceText = $("#totalPrice").text().trim();
      var currentTotal =
        parseFloat(
          totalPriceText.replace("Rp. ", "").replace(".", "").replace(",", ".")
        ) || 0;

      var quantityElement = $(
        "[id^='#stock_" + itemName.replace(/\s+/g, "_").toLowerCase() + "']"
      ).remove();
      var currentQuantity = parseInt(quantityElement.text());

      if (currentQuantity > 1) {
        currentQuantity--;
        quantityElement.text(currentQuantity);
        itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()]--;
        updateTotalAfterQuantityChange();
      } else if (currentQuantity === 1) {
        currentQuantity--;
        quantityElement.text(currentQuantity);
        itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()]--;
        updateTotalAfterQuantityChange();
      } else {
        delete itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()];
        $item.remove();
        $(this).find("#iconminus").hide();
        updateTotalAfterQuantityChange();
      }
    } else {
      console.error("Harga item tidak valid");
    }
  });

  $("#bayar").click(function () {
    console.log("Tombol 'bayar' ditekan!");
    var kiriID = $(".kiri").attr("id");
    console.log("ID kiri:", kiriID);
    window.print();
  });

  $(document).keydown(function (event) {
    if (event.ctrlKey && event.key === "p") {
      console.log("Tombol 'Ctrl + P' ditekan. Melakukan pencetakan...");

      event.preventDefault();
      window.print();
    }
  });

  $("#searchIcon").on("click", function () {
    $("#searchInput").fadeToggle("fast");
    $("#searchInput").focus();
  });

  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".isi").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $("#searchInput").on("focusout", function () {
    $(this).fadeOut("fast");
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      $("#searchInput").fadeOut("fast");
    }
  });

  $("#sortByName").on("click", function () {
    var items = $(".isi").detach();
    let ascending = true;

    items.sort(function (a, b) {
      var nameA = $(a).find("p").text().toUpperCase();
      var nameB = $(b).find("p").text().toUpperCase();

      return ascending
        ? nameA.localeCompare(nameB)
        : nameB.localeCompare(nameA);
    });

    ascending = !ascending;

    $(".kanan > section").html(items);
  });

  //otak-atik hover
  $(".iconplus").hover(
    function () {
      $(this).closest(".isi").addClass("hovered");
    },
    function () {
      $(this).closest(".isi").removeClass("hovered");
    }
  );

  //iconminus
  $(".isi").on("click", function () {
    $(this).find("#iconminus").show();
  });
});
