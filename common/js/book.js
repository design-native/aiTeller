var currentPage = 0; // 현재 페이지를 추적

$('.book')
    .on('click', '.ACTIVE .btnNext', nextPage)
    .on('click', '.flipped .btnPrev', prevPage);

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'https://story.switchflow.biz/movie/story';
const targetImageUrl = 'https://story.switchflow.biz/movie/images';


/**
 * 서버에서 데이터를 가져오는 함수
 * @param {string} prompt - 요청에 포함할 프롬프트 메시지
 */
async function fetchPageData(prompt) {
  const urlWithParams = `${targetUrl}?prompt=${encodeURIComponent(prompt)}`;

  try {
      const response = await fetch(urlWithParams, {
          method: 'POST',
          headers: {
              'X-Requested-With': 'XMLHttpRequest',
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      handleData(data);
  } catch (error) {
      console.error('Error fetching page data:', error);
      handleError(error);
  }
}
async function fetchImage(prompt) {
  const urlWithParams = `${targetImageUrl}?prompt=${encodeURIComponent(prompt)}&&imageCount=3`;

  try {
      const response = await fetch(urlWithParams, {
          method: 'POST',
          headers: {
              'X-Requested-With': 'XMLHttpRequest',
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data)

      console.log(data.data[0].url)
      
      $('#img1').css('background-image', 'url('+data.data[0].url+')');
      $('#img2').css('background-image', 'url('+data.data[1].url+')');
      $('#img3').css('background-image', 'url('+data.data[2].url+')');

    } catch (error) {
      console.error('Error fetching page data:', error);
      handleError(error);
  }
}
async function fetchChapterPageData(prompt) {
  const urlWithParams = `${targetUrl}?prompt=${encodeURIComponent(prompt)}`;
  $("#chapterTitle").html("<br/>")
  $("#chapterContents").html("<br/><br/><br/><br/><br/><br/><br/>")
  try {
      const response = await fetch(urlWithParams, {
          method: 'POST',
          headers: {
              'X-Requested-With': 'XMLHttpRequest',
          },
      });

      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const story = data.data.split("\n\n")

      const subject = story[1].split("\n")[0].replace("###","");
      const contents = story[1].split("\n")[1];
      console.log(story);
      console.log(subject);
      console.log(contents);

      let prompt = contents.split("\.")[0];
      console.log(prompt)
      
      prompt = prompt + "내용에서 주인공 이름 빼고 저작권에 걸리지 않게 이미지를 생성해줘 최대한 빨리 그릴수있게 단순하게 그려줘"
      console.log(prompt)
      fetchImage(prompt)

      $("#chapterTitle").html(subject)
      $("#chapterContents").html(contents)
  } catch (error) {
      console.error('Error fetching page data:', error);
      handleError(error);
  }
}

/**
 * 데이터를 처리하고 페이지에 표시하는 함수
 * @param {Object} data - 서버에서 가져온 JSON 데이터
 */
function handleData(data) {
    console.log(data);
    const formattedData = data.data.split('. ').join('.<br>');

    // 줄바꿈을 추가한 데이터를 <h4> 태그에 삽입
    $('.desc').html(formattedData);
}

/**
 * 에러를 처리하는 함수
 * @param {Error} error - 발생한 에러 객체
 */
function handleError(error) {
    const errorContainer = document.querySelector('.error');
    if (errorContainer) {
        errorContainer.textContent = `Error: ${error.message}`;
    }
}

/**
 * 이전 페이지로 이동
 */
function prevPage() {
    if (currentPage > 0) { // 첫 페이지보다 뒤로 갈 수 없음
        currentPage--;
        console.log(`현재 페이지: ${currentPage}`); // 현재 페이지 출력

        $('.flipped')
            .last()
            .removeClass('flipped')
            .addClass('ACTIVE')
            .siblings('.page')
            .removeClass('ACTIVE');
    } else {
        console.log('첫 페이지입니다.');
    }
}

/**
 * 다음 페이지로 이동
 */
function nextPage() {
    const totalPages = $('.page').length; // 전체 페이지 수

    if (currentPage < totalPages - 1) { // 마지막 페이지보다 앞으로 갈 수 없음
        currentPage++;
        console.log(`현재 페이지: ${currentPage}`); // 현재 페이지 출력

        $('.ACTIVE')
            .removeClass('ACTIVE')
            .addClass('flipped')
            .next('.page')
            .addClass('ACTIVE')
            .siblings();

        console.log('다음 페이지로 이동');

        if(currentPage == 1){
          fetchChapterPageData("피오키오 동화를5개의 스토리로 나눠서 1화를 한명의 성우가 읽게 해주고 스토리 하나당 1분정도분량으로 해줘 ")
        }
        // 예제: 다음 페이지로 이동할 때 데이터 가져오기
       // fetchPageData(`피노키오의 ${currentPage}번째 페이지`);
    } else {
        console.log('마지막 페이지입니다.');
    }
}
