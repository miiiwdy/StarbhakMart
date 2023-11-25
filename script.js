$(document).ready(function () {
  var hover = false;
  var rName = ["Asep", "Joko", "Yono", "Dono", "Iwan", "Yanto", "Iqbal"];
  var randomNameIndex = Math.floor(Math.random() * rName.length);
  var randomName = rName[randomNameIndex];
  $("#rname").text("Bang " + randomName);
  var itemQuantity = {};
  var itemPrices = {};
  var CartReady = false;

  $(".iconplus").on("click", function () {
    IconPlus($(this));
  });

  $(".belanja").on("click", ".remove", function () {
    RemoveItem($(this));
  });

  $(".wadahItem").on("click", "#iconminus", function () {
    MinusRemove($(this));
  });

  $(".pay").on("click", function () {
    Pay();
  });

  $(document).keydown(function (event) {
    if (event.ctrlKey && event.key === "p") {
      event.preventDefault();
      window.print();
    }
  });

  $(".iconplus").hover(
    function () {
      $(this).closest(".wadahItem").addClass("hovered");
      hover = true;
    },
    function () {
      $(this).closest(".wadahItem").removeClass("hovered");
      hover = false;
    }
  );

  $(".wadahItem").on("click", function () {
    let iconminus = $(this).find("#iconminus");
    if (!hover) {
    } else {
      iconminus.show();
    }
  });

  $("#searchIcon").on("click", function () {
    $("#searchInput").css("border-radius", "20px");
    $("#searchInput").fadeToggle("slow");
    $("#searchInput").focus();
  });

  $("#searchInput").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $(".wadahItem").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  $("#searchInput").on("focusout", function () {
    $(this).fadeOut("slow");
  });

  $(document).on("keydown", function (event) {
    if (event.key === "Escape") {
      $("#searchInput").fadeOut("fast");
    }
  });

  //function

  function MinusRemove(iconminus) {
    var $item = iconminus.closest(".barang");
    var $clickedItem = iconminus.closest(".wadahItem");
    var id = $clickedItem.data("item");
    var PayText = $(".pay p");
    var element = $(".wadahItem").filter(
      (index, value) => $(value).data("item") == id
    )[0];
    var $element = $(element).find("#iconminus");
    var itemName = $clickedItem.find("p").first().text().trim();
    var itemPriceText = $clickedItem.find("h1").text().trim();

    var itemPrice = parseFloat(
      itemPriceText.replace("Rp. ", "").replace(".", "").replace(",", ".")
    );

    if (!isNaN(itemPrice)) {
      var formattedItemName = itemName.replace(/\s+/g, "_").toLowerCase();

      if (
        itemQuantity[formattedItemName] &&
        itemQuantity[formattedItemName] > 0
      ) {
        itemQuantity[formattedItemName]--;

        if (itemQuantity[formattedItemName] === 0) {
          $element.hide();
          CartReady = false;
          PayText.replaceWith("<p>Pilih Satu Barang</p>");
          $(".belanja .barang[data-item='" + id + "']").remove();
          console.log("iconminus id removed: " + id);
          $("#stock_" + formattedItemName).text(
            itemQuantity[formattedItemName]
          );
          updateTotalAfterQuantityChange();
        } else {
          $("#stock_" + formattedItemName).text(
            itemQuantity[formattedItemName]
          );
          updateTotalAfterQuantityChange();
        }
      } else {
        console.error("quantity ga valid");
      }
    } else {
      console.error("harga item ga valid");
    }
  }

  function RemoveItem(remove) {
    var $item = remove.closest(".barang");
    var $id = remove.data("item");
    var PayText = $(".pay p");
    element = $(".wadahItem").filter(
      (index, value) => $(value).data("item") == $id
    )[0];
    var $element = $(element).find("#iconminus");
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
      } else {
        delete itemQuantity[itemName.replace(/\s+/g, "_").toLowerCase()];
        $element.hide();
        console.log("iconminus id removed: " + $id);
        $item.remove();
        CartReady = false;
        PayText.replaceWith("<p>Pilih Satu Barang</p>");
        updateTotalAfterQuantityChange();
      }
    } else {
      console.error("harga item ga valid");
    }
  }

  function IconPlus(clickedElement) {
    var $clickedItem = clickedElement.closest(".wadahItem");
    var id = $clickedItem.data("item");
    var itemName = $clickedItem.find("p").first().text().trim();
    var itemPriceText = $clickedItem.find("h1").text().trim();
    let pp = $(".pay p");

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

      var wadahItemtemExist =
        $(".belanja .barang .detail-kiri p").filter(function () {
          return $(this).text().includes(itemName);
        }).length > 0;

      if (!wadahItemtemExist) {
        var newElement = `
                  <div class="barang" data-item="${id}">
                      <div class="detail-kiri">
                          <p>${itemName} - <span id="stock_${formattedItemName}">${itemQuantity[formattedItemName]}</span></p>
                          <p class="normal">Harga: ${itemPriceText} / pcs</p>
                      </div>
                      <button class="remove" data-item="${id}">
                          <span class="material-symbols-outlined">delete</span>
                      </button>
                  </div>
              `;

        $(".belanja").append(newElement);
        updateTotalAfterQuantityChange();
        $(`#stock_${formattedItemName}`).css("color", "#0062f0");
        pp.replaceWith("<p>Checkout</p>");
        CartReady = true;
      } else {
        $("#stock_" + formattedItemName).text(itemQuantity[formattedItemName]);
        updateTotalAfterQuantityChange();
      }
    } else {
      console.error("harga item ga valid");
    }
  }

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

  function Pay() {
    const pay = $(".pay");
    const textPay = $(".pay p");

    if (!CartReady) {
      textPay.replaceWith("<p>Pilih Satu Barang</p>");
      console.log("Harus memilih minimal satu barang");
      pay.addClass('shaker');
      pay.one('animationend', () => {
        pay.removeClass('shaker')
      });
    } else {
      window.print();
    }
  }
});
