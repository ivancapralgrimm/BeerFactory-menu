// ====== ДЕМО-ДАННЫЕ ======  
const ITEMS = [  
  {name:"Яблоко-Саган", cat:"Коктейли", tags:["ягодный","освежающий"], compound:"Джин 40мл · яблочный сок 60мл · сироп саган-дайля 15мл · лайм", method:"Шейк со льдом, двойное процеживание", serving:"Коктейльный бокал, долька яблока"},  
  {name:"Дымная Гавана", cat:"Коктейли", tags:["ромовый","крепкий"], compound:"Тёмный ром 45мл · ананасовый сок 40мл · лайм 15мл · биттер", method:"Билд в стакане на льду, лёгкое копчение веточкой розмарина", serving:"Хайбол, лёд-кубик"},  
  {name:"Полынная Горечь", cat:"Коктейли", tags:["горький","аперитив"], compound:"Джин 35мл · Апероль 25мл · тоник · долька грейпфрута", method:"Билд в бокале со льдом, аккуратно долить тоник", serving:"Бокал для вина, лёд"},  
  {name:"Овсяный Штиль", cat:"Коктейли", tags:["сливочный","без алкоголя"], compound:"Овсяное молоко 100мл · эспрессо 30мл · кленовый сироп 10мл", method:"Взбить шейкером без льда, перелить на лёд", serving:"Рокс, корица сверху"},  
  {name:"Мясная тарелка домашних деликатесов", cat:"Кухня", tags:["мясная","на компанию"], compound:"Хамон, брезаола, суджук, домашняя ветчина, оливки, орехи", method:"Нарезка тонкими слайсами, выложить веером по кругу тарелки", serving:"Деревянная доска, 6 персон, горчица отдельно"},  
  {name:"Сырная тарелка", cat:"Кухня", tags:["сырная","на компанию"], compound:"Дор блю, качотта, пармезан, мёд, грецкий орех, виноград", method:"Разложить по фактуре от мягкого к твёрдому", serving:"Каменная доска, мёд в розетке"},  
  {name:"Брускетта с томатами", cat:"Кухня", tags:["лёгкая","вегетарианская"], compound:"Чиабатта, томаты черри, базилик, чеснок, олив. масло, бальзамик", method:"Обжарить хлеб, натереть чесноком, выложить томатную смесь", serving:"Тарелка, 3 шт, микрозелень"},  
  {name:"Крылья BBQ острые", cat:"Кухня", tags:["острая","горячая"], compound:"Куриные крылья, соус барбекю, чили-хлопья, сельдерей", method:"Маринад 2 часа, жарка во фритюре, глазирование соусом", serving:"Тарелка, соус блю-чиз, стебель сельдерея"},  
  {name:"Настойка «Перцовая»", cat:"Настойка", tags:["острая","крепкая"], compound:"Водка \"Русский стандарт\" 1л\nПерец Болгарский 80гр\nПерец Чили 40гр\nПерец Горошек 15гр\nСахарный Сироп 150мл", method:"Настаивать в тёмном месте 10-14 дней, ежедневно встряхивать, процедить через марлю", serving:"Рюмка, охлаждённая"},  
  {name:"Настойка апельсиновая", cat:"Настойка", tags:["цитрусовая","крепкая"], compound:"Светлый ром 750мл\nАпельсины 2 шт\nВанилин 1г\nМёд 50мл", method:"Нарезать апельсины кольцами, положить в банку с ромом, добавить ванилин и мёд, закрыть, настаивать 21 день", serving:"Рюмка, льдинка"},  
];  
  
// ====== ПОДКЛЮЧЕНИЕ К СВОЕЙ БАЗЕ NOCODB ======  
const CONFIG = {  
  useRemote: true,  
  baseUrl: "https://nocodb.puzzlebot.top",  
  tableId: "mqo5ga1nk6h8lv8",  
  kitchenTableId: "mc7m3sa4m2x12dd",  
  token: "uDwIj1M4tM3DkQdrJItq54GkxbdJFCJ6OUhETjA9",  
  categoryField: "Категория",  
};  
  
const CATEGORY_ICONS = {};  
document.querySelectorAll('#tabs .drawer-item[data-cat]').forEach(btn => {  
  const cat = btn.dataset.cat;  
  if (cat === 'all') return;  
  const firstWord = btn.querySelector('.di-label').textContent.trim().split(/\s+/)[0];  
  CATEGORY_ICONS[cat] = firstWord;  
});  
  
let DATA = ITEMS;  
  
async function fetchTable(tableId, forcedCategory){  
  const url = `${CONFIG.baseUrl}/api/v2/tables/${tableId}/records?limit=1000`;  
  const res = await fetch(url, { headers: { "xc-token": CONFIG.token } });  
  if(!res.ok) throw new Error("NocoDB ответил " + res.status + " для таблицы " + tableId);  
  const json = await res.json();  
  const rows = json.list || [];  
  return rows.map(r => {  
    const cat = forcedCategory || (r[CONFIG.categoryField] || "").trim() || "Коктейли";  
    let compound, method, serving;  
    if (cat === "Кухня") {  
      compound = r["Состав"] || "—";  
      method = r["Описание"] || "—";  
      serving = r["Граммовка"] || "—";  
    } else {  
      compound = r["Состав"] || "—";  
      method = r["Метод"] || r["Приготовление"] || "—";  
      serving = r["Подача"] || r["Вес"] || "—";  
    }  
    return {  
      name: r["Название"] || "Без названия",  
      cat: cat,  
      tags: (r["Теги"] || "").split(/\s+/).filter(Boolean),  
      compound: compound,  
      method: method,  
      serving: serving,  
      photo: r["Фото-ссылка"] || null,  
    };  
  });  
}  
  
async function loadData(){  
  if(!CONFIG.useRemote) return;  
  try{  
    const [mainItems, kitchenItems] = await Promise.all([  
      fetchTable(CONFIG.tableId, null),  
      CONFIG.kitchenTableId  
        ? fetchTable(CONFIG.kitchenTableId, "Кухня")  
        : Promise.resolve([]),  
    ]);  
    DATA = [...mainItems, ...kitchenItems];  
  }catch(e){  
    console.error("Не удалось загрузить NocoDB, показаны демо-данные:", e);  
  }  
}  
  
let state = { cat: "all", query: "" };  
  
function matches(item){  
  if(state.cat !== "all" && item.cat !== state.cat) return false;  
  if(state.query){  
    const q = state.query.toLowerCase();  
    const hay = (item.name + " " + item.tags.join(" ")).toLowerCase();  
    if(!hay.includes(q)) return false;  
  }  
  return true;  
}  
  
const UNIT_PATTERN = /(\d+(?:[.,]\d+)?\s*(?:мл|гр|г|кг|л|шт|порц\.?|долька|дольки|долек|слайс|слайса|слайсов|лист|листик|листика|листа|стебель|стебля|палочка|палочки|щепотка|щепотки|капля|капли|капель|зубчик|зубчика|зубчиков|пучок|пучка|ч\.л\.|ст\.л\.)\.?)\s+(?=[А-ЯЁ])/g;  
  
function ingredientRows(text){  
  let raw = String(text || "—").trim();  
  let lines;  
  if(/\\n/.test(raw)){  
    lines = raw.split(/\\n+/);  
  } else if(/\n/.test(raw)){  
    lines = raw.split(/\n+/);  
  } else {  
    const withBreaks = raw.replace(UNIT_PATTERN, "$1\n");  
    lines = withBreaks.split(/\n+/);  
  }  
  lines = lines.map(s => s.trim()).filter(Boolean);  
  if(lines.length === 0) lines = ["—"];  
  return lines.map(line => `<div class="ingredient-row">${line}</div>`).join("");  
}  
  
// ========== КАЛЬКУЛЯТОР ПОРЦИЙ ДЛЯ НАСТОЕК ==========  
  
function splitCompoundToLines(text){  
  let raw = String(text || "").trim();  
  let lines;  
  if(/\\n/.test(raw)){  
    lines = raw.split(/\\n+/);  
  } else if(/\n/.test(raw)){  
    lines = raw.split(/\n+/);  
  } else if(/·/.test(raw)){  
    lines = raw.split(/·/);  
  } else {  
    const withBreaks = raw.replace(UNIT_PATTERN, "$1\n");  
    lines = withBreaks.split(/\n+/);  
  }  
  return lines.map(s => s.trim()).filter(Boolean);  
}  
  
const INGREDIENT_RE = /^(.+?)\s+(\d+(?:[.,]\d+)?)\s*(мл|гр|г|кг|л|шт|порц|долька|дольки|долек|слайс|слайса|слайсов|лист|листик|листика|листа|стебель|стебля|палочка|палочки|щепотка|щепотки|капля|капли|капель|зубчик|зубчика|зубчиков|пучок|пучка|ч\.л\.|ст\.л\.)?\.?$/;  
  
function parseIngredients(text){  
  const lines = splitCompoundToLines(text);  
  return lines.map(line => {  
    const match = line.match(INGREDIENT_RE);  
    if(!match){  
      return { original: line, ingredient: line, number: null, unit: "" };  
    }  
    return {  
      original: line,  
      ingredient: match[1].trim(),  
      number: parseFloat(match[2].replace(",", ".")),  
      unit: match[3] || "",  
    };  
  });  
}  
  
function formatScaledNumber(num){  
  const rounded = Math.round(num * 100) / 100;  
  return String(rounded);  
}  
  
function scaleRecipe(text, multiplier){  
  const ingredients = parseIngredients(text);  
  return ingredients.map(ing => {  
    if(ing.number === null){  
      return ing.original;  
    }  
    const scaled = formatScaledNumber(ing.number * multiplier);  
    return `${ing.ingredient} ${scaled}${ing.unit ? " " + ing.unit : ""}`;  
  });  
}  
  
function createPortionCalculator(itemName){  
  const safeId = "calc-" + itemName.replace(/[^a-zA-Zа-яА-Я0-9]+/g, "-").toLowerCase();  
  return `  
    <div class="portion-calculator">  
      <div class="calc-header">  
        <label class="calc-label" for="${safeId}">Рассчитать на N порций</label>  
        <div class="calc-input-wrap">  
          <input  
            type="number"  
            id="${safeId}"  
            class="portion-input"  
            value="1"  
            min="0.5"  
            step="0.5"  
            inputmode="decimal"  
          >  
          <span class="calc-unit">порций (можно дробное, напр. 3.5)</span>  
        </div>  
      </div>  
      <div class="scaled-recipe"></div>  
    </div>  
  `;  
}  
  
// ========== ЛАЙТБОКС: УВЕЛИЧЕНИЕ ФОТО ПО КЛИКУ ==========  
const lightboxOverlay = document.getElementById("lightboxOverlay");  
const lightboxImg = document.getElementById("lightboxImg");  
const lightboxClose = document.getElementById("lightboxClose");  
  
function openLightbox(src, alt){  
  lightboxImg.src = src;  
  lightboxImg.alt = alt || "";  
  lightboxOverlay.classList.add("open");  
  document.body.style.overflow = "hidden";  
}  
function closeLightbox(){  
  lightboxOverlay.classList.remove("open");  
  document.body.style.overflow = "";  
  lightboxImg.src = "";  
}  
lightboxClose.addEventListener("click", closeLightbox);  
lightboxOverlay.addEventListener("click", (e) => {  
  if(e.target === lightboxOverlay) closeLightbox();  
});  
document.addEventListener("keydown", (e) => {  
  if(e.key === "Escape" && lightboxOverlay.classList.contains("open")) closeLightbox();  
});  
  
function render(){  
  const grid = document.getElementById("grid");  
  const empty = document.getElementById("empty");  
  const list = DATA.filter(matches);  
  
  document.getElementById("count").textContent = list.length + " позиций";  

  // Мягкий кросс-фейд: гасим текущее содержимое, затем перерисовываем
  grid.classList.add("fading");  
  setTimeout(() => renderList(list), 150);  

  function renderList(list){  
  grid.innerHTML = "";  
  empty.style.display = list.length ? "none" : "block";  
  
  list.forEach((item, idx) => {  
    const isKitchen = item.cat === "Кухня";  
    const isRecipe = item.cat === "Настойка";  
    const icon = CATEGORY_ICONS[item.cat] || "🍹";  
  
    const card = document.createElement("div");  
    card.className = "card";  
    card.innerHTML = `  
  <div class="card-inner">  
    <div class="face front ${isKitchen ? 'kitchen' : ''}">  
      <div>  
        <div class="cat-icon">${icon}</div>  
        <div class="card-name">${item.name}</div>  
        <div class="tags">${item.tags.map(t=>`<span class="tag">${t}</span>`).join("")}</div>  
      </div>  
      <div class="tap-hint">тапни для рецепта →</div>  
    </div>  
    <div class="face back">  
      ${item.photo ? `<img class="back-photo" src="${item.photo}" alt="${item.name}">` : ''}  
      <div class="ticket-name">${item.name}</div>  
      ${!isKitchen ? `<b>Состав</b><div class="ingredient-table">${ingredientRows(item.compound)}</div>` : ''}  
      ${isRecipe ? createPortionCalculator(item.name) : ''}  
      <b>${isKitchen ? 'Описание' : 'Метод'}</b>${item.method}  
      <b>${isKitchen ? 'Граммовка' : 'Подача'}</b>${item.serving}  
    </div>  
  </div>`;  
  
    const front = card.querySelector(".front");  
    const back = card.querySelector(".back");  
    front.addEventListener("click", () => card.classList.add("flipped"));  
    back.addEventListener("click", () => card.classList.remove("flipped"));  
  
    grid.appendChild(card);  
  
    const photoImg = back.querySelector(".back-photo");  
    if(photoImg){  
      photoImg.addEventListener("click", (e) => {  
        e.stopPropagation();  
        openLightbox(photoImg.src, photoImg.alt);  
      });  
    }  
  
    if(isRecipe){  
      const portionInput = back.querySelector(".portion-input");  
      const scaledDiv = back.querySelector(".scaled-recipe");  
      const originalCompound = item.compound;  
  
      function updateScaledRecipe(){  
        const raw = parseFloat(portionInput.value);  
        const multiplier = (!isNaN(raw) && raw > 0) ? raw : 1;  
        const rows = scaleRecipe(originalCompound, multiplier);  
        const rowsHtml = rows.length  
          ? rows.map(r => `<div class="scaled-row">• ${r}</div>`).join("")  
          : `<div class="scaled-empty">Не удалось разобрать состав на ингредиенты.</div>`;  
        scaledDiv.innerHTML = `<strong>На ${multiplier} порций</strong>` + rowsHtml;  
      }  
  
      portionInput.addEventListener("input", updateScaledRecipe);  
      portionInput.addEventListener("change", updateScaledRecipe);  
      portionInput.addEventListener("click", (e) => e.stopPropagation());
      portionInput.addEventListener("touchstart", (e) => e.stopPropagation());
      portionInput.addEventListener("focus", (e) => e.stopPropagation());
  
  
      updateScaledRecipe();  
    }  
  
    const naturalHeight = back.scrollHeight + 8;  
    card.style.setProperty("--flip-h", Math.max(naturalHeight, 220) + "px");  

    // Поэтапное (каскадное) появление карточек, но не дольше ~0.4с суммарно
    card.style.animationDelay = Math.min(idx * 35, 380) + "ms";  
  });  

  // Возвращаем видимость грида после того как новые карточки вставлены в DOM
  requestAnimationFrame(() => grid.classList.remove("fading"));  
  }  
}  
  
const drawer = document.getElementById("drawer");  
const drawerOverlay = document.getElementById("drawerOverlay");  
const menuLabel = document.getElementById("menuLabel");  
  
function openDrawer(){  
  drawer.classList.add("open");  
  drawerOverlay.classList.add("open");  
  document.body.style.overflow = "hidden";  
}  
function closeDrawer(){  
  drawer.classList.remove("open");  
  drawerOverlay.classList.remove("open");  
  document.body.style.overflow = "";  
}  
document.getElementById("menuBtn").addEventListener("click", openDrawer);  
document.getElementById("drawerClose").addEventListener("click", closeDrawer);  
drawerOverlay.addEventListener("click", closeDrawer);  
  
document.getElementById("tabs").addEventListener("click", (e) => {  
  const btn = e.target.closest(".drawer-item");  
  if(!btn) return;  
  document.querySelectorAll(".drawer-item").forEach(t => t.classList.remove("active"));  
  btn.classList.add("active");  
  state.cat = btn.dataset.cat;  
  menuLabel.textContent = btn.querySelector(".di-label").textContent;  
  render();  
  closeDrawer();  
});  
  
const searchSlot = document.getElementById("searchSlot");  
const searchInput = document.getElementById("search");  
document.getElementById("searchIconBtn").addEventListener("click", () => {  
  searchSlot.classList.add("open");  
  searchInput.focus();  
});  
searchInput.addEventListener("blur", () => {  
  if(!searchInput.value.trim()) searchSlot.classList.remove("open");  
});  
  
document.getElementById("search").addEventListener("input", (e) => {  
  state.query = e.target.value.trim();  
  render();  
});  
  
document.getElementById("surprise").addEventListener("click", () => {  
  const pool = DATA.filter(i => state.cat === "all" ? true : i.cat === state.cat);  
  const pick = pool[Math.floor(Math.random() * pool.length)];  
  document.getElementById("search").value = "";  
  state.query = "";  
  render();  
  const cards = [...document.querySelectorAll(".card-name")];  
  const target = cards.find(c => c.textContent === pick.name);  
  if(target){  
    const card = target.closest(".card");  
    card.scrollIntoView({behavior:"smooth", block:"center"});  
    setTimeout(() => card.classList.add("flipped"), 350);  
  }  
});  
  
const toTopBtn = document.getElementById("toTop");  
document.body.addEventListener("scroll", () => {  
  if(document.body.scrollTop > window.innerHeight * 0.6){  
    toTopBtn.classList.add("visible");  
  } else {  
    toTopBtn.classList.remove("visible");  
  }  
});  
toTopBtn.addEventListener("click", () => {  
  document.body.scrollTo({ top: 0, behavior: "smooth" });  
});  
  
loadData().then(render);  
