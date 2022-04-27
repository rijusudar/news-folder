const leftPaneArticlesWrapEle = document.querySelector('.left-pane__articles');
const docFrag = document.createDocumentFragment();
const collectionType = 'landing';

const fetchCollectionInfo = async () => {
  try {
    const response = await fetch('./resources/collection-info.json');
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const datas = await response.json();
    const landingData = datas.filter(data => data.collectiontype === collectionType);
    const collectionId = landingData[0].collectionid;
    fetchCollectionArticle(collectionId);
  } catch (error) {
    console.log(error);
  }
}

const fetchCollectionArticle = async (collectionId) => {
  try {
    const response = await fetch('./resources/collection-article.json');
    if (!response.ok) {
      throw new Error('Something went wrong!');
    }
    const datas = await response.json();
    const getArticleData = datas.filter(article => article.collectionId === collectionId);
    getArticleData && renderArticleData(getArticleData[0].collectionData);
  } catch (error) {
    console.log(error);
  }
}

const renderDescriptionMarkup = (description, index) => {
  let ribbonTemplate;
  if (index === 0) {
    ribbonTemplate = `<span class="article__description--attention">Rabbitohs Star</span>`;
  } else if (index === 1) {
    ribbonTemplate = `<span class="article__description--exclusive">Exclusive</span>`;
  }
  return description ? `
  <p class="article__description">
    ${ribbonTemplate}
    ${description}
  </p>
  ` : ''
};

const timeAndCommentMarkup = (timestamp, commentCount = 0) => {
  const timeMarkup = timestamp ? `
    <li class="article__option">
      <i class="fa-regular fa-clock"></i>
      <span class="option__value">${timestamp}hr</span>
    </li>
    `: '';
  const commentMarkup = Number(commentCount) !== 0 ? `
    <li class="article__option">
      <i class="fa-brands fa-rocketchat"></i>
      <span class="option__value">${commentCount}</span>
    </li>
    `: '';
  return `
    <ul class="article__options">
      ${timeMarkup}
      ${commentMarkup}
    </ul>
  `
}

const renderArticleMarkup = ({
  imageUrl,
  title,
  intro,
  published,
  commentCount
}, index) => {
  return `
    <figure class="article__figure ">
      <img
        class="article__figure-img"
        src="${imageUrl}"
        alt="${title}"
      />
    </figure>
    <div class="article__details">
      <div class="article__contents">
        <h4 class="article__title">
          ${title}
        </h4>
        ${renderDescriptionMarkup(intro, index)}
      </div>
      ${timeAndCommentMarkup(published, commentCount)}
    </div>
  `;
}

const renderArticleData = (data) => {
  data && data.map((article, index) => {
    if (index < 4) {
      const leftPaneArticleEle = document.createElement("div");
      leftPaneArticleEle.classList.add('left-pane__article');
      leftPaneArticleEle.innerHTML = renderArticleMarkup(article, index);
      docFrag.appendChild(leftPaneArticleEle);
    }
  });
  leftPaneArticlesWrapEle.appendChild(docFrag);
}

function init() {
  fetchCollectionInfo();
}

init();
