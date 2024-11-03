// 이미지 클릭 시 새로 고침
const refreshImage = document.getElementById('refreshImage');

refreshImage.addEventListener('click', function() {
    location.reload(); 
});


var container = document.getElementById('map');
var options = {
	center: new kakao.maps.LatLng(37.6042813, 127.0424899), //지도의 중심좌표. 서울 한가운데
	level: 3, 
  };

//1. 컨트롤러
var map = new kakao.maps.Map(container, options);

var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

//2. 더미데이터
async function getDataSet(category){
	let qs = category;
	if(!qs) {
		qs = "";
	}

	const dataSet = await axios({
		method: "get",
		url: `http://localhost:3000/restaurant?category=${qs}`,
		headers: {},
		data: {},
	});

	return dataSet.data.result
}

getDataSet();

//3.지도에 마커 찍기
var geocoder = new kakao.maps.services.Geocoder();

var imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 

function getCoordsByAddress(address) {
	return new Promise((resolve, reject) => {
		geocoder.addressSearch(address, function(result, status) {
			if (status === kakao.maps.services.Status.OK) {
				var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
				resolve(coords);
				return;
			} 
			reject(new Error("GetGoordsByAddress Error: not Valide Address"));
		});
	});
}

//4.마커에 인포윈도우 붙이기
function getContents(data){
	return `<div class="infowindow">
		<div class="infowindow-body">
			<h5 class="infowindow-title">${data.title}</h5>
			<p class="infowindow-address">${data.address}</p>
			<a href="${data.link}" class="infowindow-btn" target="_blank">바로가기</a>
		</div>
	</div>`
}

async function setMap(dataSet) {
	const offset = 0.00002; 

	for (let i = 0; i < dataSet.length; i++) {
		try {
			var imageSize = new kakao.maps.Size(24, 35); 
			var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 

			let coords = await getCoordsByAddress(dataSet[i].address);
			if (!coords) continue; 

			let adjustedCoords = new kakao.maps.LatLng(
				coords.getLat() + (Math.random() - 0.00007) * offset, 
				coords.getLng() + (Math.random() - 0.00007) * offset 
			);


			var marker = new kakao.maps.Marker({
				map: map,
				position: adjustedCoords,
				image: markerImage,
				zIndex: 1 
			});
			markerArray.push(marker);

			var infowindow = new kakao.maps.InfoWindow({
				content: getContents(dataSet[i]),
				zIndex: 3 
			});
			infowindowArray.push(infowindow);

			kakao.maps.event.addListener(marker, 'mouseover', function() {
				marker.setZIndex(2);
			});
			kakao.maps.event.addListener(marker, 'mouseout', function() {
				marker.setZIndex(1); 
			});
			kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow, adjustedCoords));
			kakao.maps.event.addListener(map, 'click', makeOutListener(infowindow));

		} catch (error) {
			console.error(`Error processing ${dataSet[i].address}: ${error.message}`);
		}
	}
}

//인포윈도우를 표시하는 클로저
function makeOverListener(map, marker, infowindow, coords) {
    return function() {
		closeInfoWindow();
        infowindow.open(map, marker);
		map.panTo(coords);
    };
}
let infowindowArray = [];
function closeInfoWindow() {
	for (infowindow of infowindowArray){
		infowindow.close();
	}
}

// 인포윈도우를 닫는 클로저
function makeOutListener(infowindow) {
    return function() {
        infowindow.close();
    };
}

const categoryMap = {
	korea: "한식",
	china: "중식",
	japan: "일식",
	america: "양식",
	isian: "아시안",
	snack: "분식",
	dessert: "커피/디저트",
	night: "야식",
	fast: "간편식",
	etc: "기타"
};

const categoryList = document.querySelector(".category-list");
categoryList.addEventListener("click", categoryHandler);

async function categoryHandler(event) {
	const categoryId = event.target.id;
	const category = categoryMap[categoryId];

	try {
		let categorizedDataSet = await getDataSet(category);

		if (category === "기타") {
			const allDataSet = await getDataSet(); 
			if (allDataSet.length > 0) { 
				const randomIndex = Math.floor(Math.random() * allDataSet.length); 
				categorizedDataSet = [allDataSet[randomIndex]]; 
			} else {
				categorizedDataSet = [];
			}
		}	


		closeMarker();
		closeInfoWindow();

		setMap(categorizedDataSet);
	}catch(error){
		console.error(error);
	}
}


let markerArray = [];
function closeMarker(){
	for (marker of markerArray){
		marker.setMap(null)
	}
}

async function setting() {
	try{
		const dataSet = await getDataSet();
		setMap(dataSet);
	}catch(error){
		console.error(error);
	}
}

setting();