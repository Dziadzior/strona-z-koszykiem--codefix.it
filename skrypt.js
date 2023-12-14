let koszykIkona = document.querySelector(".koszykIkona");
let koszyk = document.querySelector(".koszyk");
let blok = document.querySelector(".blok");
let zamknij = document.querySelector(".zamknij");

koszykIkona.addEventListener("click", () => {
  if (koszyk.style.right == "-100%") {
    koszyk.style.right = "-250px";
    blok.style.transform = "translateX(-100px)";
  } else {
    koszyk.style.right = "-100%";
    blok.style.transform = "translateX(0)";
  }
});
zamknij.addEventListener("click", () => {
  koszyk.style.right = "-100%";
  blok.style.transform = "translateX(0)";
});

let produkty = null;
// Pobierz dane z pliku JSON
fetch('produkty.json')
.then(response => response.json())
.then(data => {
    produkty = data;
    dodajDataDoHTML();
})

// Pokaz liste Data w HTML 
function dodajDataDoHTML() {
    // Usun domyslna data z HTML
    let prooduktListaHTML = document.querySelector('.produktLista');
    prooduktListaHTML.innerHTML = '';

    // Dodaj nowa Data 
    if(produkty !=null) {
        produkty.forEach(produkt => {
            let nowyProdukt = document.createElement('div');
            nowyProdukt.classList.add('zaw');
            nowyProdukt.innerHTML = `
            <img src="${produkt.zdj}">
          <h2>${produkt.nazwa}</h2>
          <div class="cena">${produkt.cena}</div>
          <button>Do Koszyka</button>`;
          prooduktListaHTML.appendChild(nowyProdukt);
        })
    }
}

let koszykLista = [];
// Wez coockie z Data koszyka
function sprawdzKosz() {
    var cookieWartosc = document.cookie
    .split('; ')
    .find(row => row.startsWith('koszykLista='));
    if(cookieWartosc) {
        koszykLista = JSON.parse(cookieWartosc.split('=')[1]);
    }
}
sprawdzKosz();
function dodajKosz($idProdukt) {
    let produktKopia = JSON.parse(JSON.stringify(produkty));
    // Jesli produkt nie jest w koszyku
    if(!koszykLista[$idProdukt]) {
        let dataProdukt = produktKopia.filter(prodkt => prodkt.id == $idProdukt)[0];
        // Dodaj Data produkt do koszyka
        koszykLista[$idProdukt] = dataProdukt;
        koszykLista[$idProdukt].ilosc = 1; 
    } else {
        // Jesli produkt jest w koszyku zwieksz ilosc
        koszykLista[$idProdukt].ilosc++;
    }
    // Zapisz Data w cookies i po włączeniu z powrotem strony, lub komputera
    let bezpiecznyCzas = 'expires=Thu, 31 Dec 2025 23:59:59 UTC';
    document.cookie = "koszykLista="+JSON.stringify(koszykLista)+"; "+bezpiecznyCzas+"; path=/;";
    dodajKoszDoHTML();
}

dodajKoszDoHTML();
function dodajKoszDoHTML() {
    // Wyczysc domyslna Data
    let koszykListaHTML = document.querySelector('.koszykLista');
    koszykLista.innerHTML = '';

    let calaHTML = document.querySelector('.calaIlosc');
    let calaIloscKosz = 0;

    if(koszykLista) {
        koszykLista.forEach(produkt => {
            if(produkt) {
                let nowyKosz = document.createElement('div');
                nowyKosz.classList.add('zaw');
                nowyKosz.innerHTML = `
                <img src="${produkt.zdj}" />
            <div class="srodek">
              <div class="nazwa">${produkt.nazwa}</div>
              <div class="cena">${produkt.cena}/1 produkt</div>
            </div>
            <div class="ilosc">
                <button>-</button>
                <span class="wartosc">${produkt.ilosc}</span>
                <button>+</button>
            </div>`;
            koszykListaHTML.appendChild(nowyKosz);
            calaIloscKosz = calaIloscKosz + produkt.ilosc;
            }
        })
    }
    calaHTML.innerHTML = calaIloscKosz;
}
