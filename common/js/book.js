var currentPage = 0; // 현재 페이지를 추적

$('.book')
    .on('click', '.ACTIVE .btnNext', nextPage)
    .on('click', '.flipped .btnPrev', prevPage);

const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const targetUrl = 'http://ss.tosky.co.kr:8080/movie/story';
const targetImageUrl = 'http://ss.tosky.co.kr:8080/movie/images';
//const targetMovieUrl = 'http://localhost:8080/movie/movie/compose';
const targetMovieUrl = 'http://ss.tosky.co.kr:8080/movie/movie/compose';
const targetVoiceUrl = 'http://ss.tosky.co.kr:8080/movie/voice';

let imageUrl=""
let voiceUrl=""

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

      console.log(data.data[0])
      
      for(i=0;i<data.data.length;i++){
        index = i+1;
        $('#img'+index).css({'background-image': 'url('+data.data[i]+')','background-size': 'cover'});

      }
 
    } catch (error) {
      console.error('Error fetching page data:', error);
      handleError(error);
  }
}
async function fetchVoice(prompt) {

    const simplePrompt = prompt.split("\.")[0] + prompt.split("\.")[1]


    var selectedValue = $("#selVoice").val();
    const urlWithParams = `${targetVoiceUrl}?text=${encodeURIComponent(simplePrompt)}&voice_id=${selectedValue}`;
  
    try {
        const response = await fetch(urlWithParams, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                "Content-Type": "application/json",
            },
        });
  
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        const url = voiceUrl = data.data;

        // audio의 source 태그의 src 속성 변경
        $('#audioSource').attr('src', url);

        // audio 태그를 새로 고침하여 변경된 소스를 로드
        $('#audioPlayer')[0].load();
        $('#audioPlayer')[0].play();



        console.log(data)
      } catch (error) {
        console.error('Error fetching page data:', error);
        handleError(error);
    }
  }
 function addLineBreaks(prompt, maxLength = 50) {
    const words = prompt.split(" ");
    let result = "";
    let currentLine = "";

    for (const word of words) {
        if ((currentLine + word).length > maxLength) {
            result += currentLine.trim() + "\n";
            currentLine = word + " ";
        } else {
            currentLine += word + " ";
        }
    }

    // 마지막 줄 추가
    result += currentLine.trim();
    return result;
}
  async function fetchMovie(title,prompt) {
    // URL과 파라미터 구성
    const urlWithParams = `${targetMovieUrl}?text=${encodeURIComponent(prompt)}`;

    try {

        // Image URL에서 파일 데이터를 가져오기
        imageUrl = imageUrl.replace("url(\"","")
        imageUrl = imageUrl.replace("\")","")
        const imageResponse = await fetch(imageUrl);

        console.log("imageUrl="+imageUrl)

        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image file! status: ${imageResponse.status}`);
        }
        const imageBlob = await imageResponse.blob();
        const imageFile = new File([imageBlob], 'image.jpg', { type: 'image/jpeg' });

        // FormData 생성 및 데이터 추가
        const formData = new FormData();
        const formattedPrompt = addLineBreaks(prompt, 30);

        const voiceId = $("#selVoice2").val();

        formData.append('voiceId', voiceId); // 텍스트 추가
        formData.append('title', title); // 텍스트 추가
        formData.append('subtitle', formattedPrompt); // 텍스트 추가
        formData.append('bg_image', imageFile); // 이미지 파일 추가


        // 멀티파트 데이터 전송
        const response = await fetch(targetMovieUrl, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const url = data.data;

        console.log(data);
        // src 변경
        $('#videoSource').attr('src', url);

        // 비디오 재생
        const videoPlayer = $('#videoPlayer')[0];
        videoPlayer.load();  // 새로운 소스를 로드
        videoPlayer.play();  // 비디오 재생

    } catch (error) {
        console.error('Error fetching page data:', error);
        handleError(error);
    }
}
async function fetchChapterPageData(prompt) {
    $('#img1').css({
        'background-image': 'url(./common/resources/loader.gif)',
        'background-size': 'auto 100%', // 배경 이미지 크기를 50%로 설정
        'background-repeat': 'no-repeat', // 반복 방지 (필요시)
        'background-position': 'center' // 중앙 정렬 (선택사항)
      });
      $('#img2').css({
        'background-image': 'url(./common/resources/loader.gif)',
        'background-size': 'auto 100%', // 배경 이미지 크기를 50%로 설정
        'background-repeat': 'no-repeat', // 반복 방지 (필요시)
        'background-position': 'center' // 중앙 정렬 (선택사항)
      });
      $('#img3').css({
        'background-image': 'url(./common/resources/loader.gif)',
        'background-size': 'auto 100%', // 배경 이미지 크기를 50%로 설정
        'background-repeat': 'no-repeat', // 반복 방지 (필요시)
        'background-position': 'center' // 중앙 정렬 (선택사항)
      });


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
      handleChapterPage(data,prompt);

  } catch (error) {
      console.error('Error fetching page data:', error);
      handleError(error);
  }
}
function handleChapterPage(data,prompt){
    const story = data.data.split("\n\n")

    const subject = story[1].split("\n")[0].replace("###","");
    const contents = story[1].split("\n")[1];


    if (contents == undefined){
        fetchChapterPageData(prompt);
        return;
    }else{
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
      $("#chapterTitle2").html(subject)
      $("#chapterContents2").html(contents)
      $("#chapterTitle3").html(subject)
      $("#chapterContents3").html(contents)
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
function initializeAudioPlayer(audioElement, newSrc) {
    $(audioElement).attr("src", newSrc); // src 속성 변경
    audioElement.load(); // 새 소스를 로드
    audioElement.play(); // 새 소스 재생
  }