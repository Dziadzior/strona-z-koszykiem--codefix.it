let ikonaKoszyk = document.querySelector(".ikona-koszyk");
let zamKoszyk = document.querySelector(".zamknij");
let listaProduktowHTML = document.querySelector(".listaProduktow");
let listaHTML = document.querySelector(".lista");
let ikonaKoszykSpan = document.querySelector(".ikona-koszyk span");
let body = document.querySelector("body");

let listaProduktow = [];
let koszyki = [];

ikonaKoszyk.addEventListener("click", () => {
  body.classList.toggle("pokaKoszyk");
});

zamKoszyk.addEventListener("click", () => {
  body.classList.remove("pokaKoszyk");
});

const dodajIDdoHTML = () => {
  listaProduktowHTML.innerHTML = "";
  if (listaProduktow.length > 0) {
    listaProduktow.forEach((produkt) => {
      let nowyProdukt = document.createElement("div");
      nowyProdukt.classList.add("item");
      nowyProdukt.dataset.id = produkt.id;
      nowyProdukt.innerHTML = `
      <img src="${produkt.zdj}" alt="">
      <h2>${produkt.nazwa}</h2>
      <div class="cena">${produkt.cena}</div>
      <button class="dodaj-kosz">
          Dodaj do koszyka
      </button>
                `;
      listaProduktowHTML.appendChild(nowyProdukt);
    });
  }
};

const dodajDoKoszyk = (produkt_id) => {
  let produktWKoszyku = koszyki.findIndex(
    (value) => value.produkt_id == produkt_id
  );
  if (koszyki.length <= 0) {
    koszyki = [
      {
        produkt_id: produkt_id,
        ilosc: 1,
      },
    ];
  } else if (produktWKoszyku < 0) {
    koszyki.push({
      produkt_id: produkt_id,
      ilosc: 1,
    });
  } else {
    koszyki[produktWKoszyku].ilosc = koszyki[produktWKoszyku].ilosc + 1;
  }

  dodajKoszykDoHTML();
  dodajKoszykDoPamieci();
};

const dodajKoszykDoPamieci = () => {
  localStorage.setItem("koszyk", JSON.stringify(koszyki));
};
const dodajKoszykDoHTML = () => {
  listaHTML.innerHTML = "";
  let calaIlosc = 0;
  if (koszyki.length > 0) {
    koszyki.forEach((koszyk) => {
      calaIlosc = calaIlosc + koszyk.ilosc;
      let nowyKosz = document.createElement("div");
      nowyKosz.classList.add("item");
      nowyKosz.dataset.id = koszyk.produkt_id;
      let pozycjaProduktu = listaProduktow.findIndex(
        (value) => value.id == koszyk.produkt_id
      );
      let info = listaProduktow[pozycjaProduktu];
      nowyKosz.innerHTML = `
            <div class="zdjecie">
                <img src="${info.zdj}" alt="">
                </div>
                <div class="nazwa">
                ${info.nazwa}
                </div>
                <div class="cena">${info.cena * koszyk.ilosc}</div>
                <div class="ilosc">
                    <span class="minus">-</span>
                    <span>${koszyk.ilosc}</span>
                    <span class="plus">+</span>
                </div>`;
      listaHTML.appendChild(nowyKosz);
    });
  }
  ikonaKoszykSpan.innerText = calaIlosc;
};

listaHTML.addEventListener("click", (event) => {
  let klikniecieKontrola = event.target;
  if (
    klikniecieKontrola.classList.contains("minus") ||
    klikniecieKontrola.classList.contains("plus")
  ) {
    let produkt_id = klikniecieKontrola.parentElement.dataset.id;
    let type = "minus";
    if (klikniecieKontrola.classList.contains("plus")) {
      type = "plus";
    }
    zmienIloscKoszyka(produkt_id, type);
  }
});

const zmienIloscKoszyka = (produkt_id, type) => {
  let produktWKoszyku = koszyki.findIndex(
    (value) => value.produkt_id == produkt_id
  );
  if (produktWKoszyku >= 0) {
    switch (type) {
      case "plus":
        koszyki[produktWKoszyku].ilosc = koszyki[produktWKoszyku].ilosc + 1;
        break;

      default:
        let zmienWartosc = koszyki[produktWKoszyku].ilosc - 1;
        if (zmienWartosc > 0) {
          koszyki[produktWKoszyku].ilosc = zmienWartosc;
        } else {
          koszyki.splice(produktWKoszyku, 1);
        }
        break;
    }
  }
  dodajKoszykDoHTML();
  dodajKoszykDoPamieci();
};

listaProduktowHTML.addEventListener("click", (event) => {
  let klikniecie = event.target;
  if (klikniecie.classList.contains("dodaj-kosz")) {
    let produkt_id = klikniecie.parentElement.dataset.id;
    dodajDoKoszyk(produkt_id);
  }
});

const jsonApp = () => {
  // pobieranie info z json
  fetch("produkty.json")
    .then((response) => response.json())
    .then((data) => {
      listaProduktow = data;
      dodajIDdoHTML();

      // odzyskaj koszyk z pamięci
      if (localStorage.getItem("koszyk")) {
        koszyki = JSON.parse(localStorage.getItem("koszyk"));
        dodajKoszykDoHTML();
      }
    });
};
jsonApp();
