let events = new Map();

let oldRoot = null;

export function setupEventListeners(root) {
    // 초기등록 로직
    if (oldRoot !== root) {
        oldRoot = root;
        events.forEach((element) => {
            element.forEach((eventType, handler) => {
                root.addEventListener(handler, eventType);
            });
        });
    } //이미 등록한적이 있을 때
    else {
        //지우고
        events.forEach((element) => {
            element.forEach((eventType, handler) => {
                oldRoot.removeEventListener(handler, eventType);
            });
        });
        //다시 등록
        events.forEach((element) => {
            element.forEach((eventType, handler) => {
                root.addEventListener(handler, eventType);
            });
        });
    }
}

//createElement("button") === createElement("button") 인가?
// ==> nope 각각 다른 객체

// 엘리먼트 별로 핸들러를 관리하도록 해보기 ==> 통과

// 엘리먼트별로 핸들러를 관리하는데 버블링 우째처리하노...
// 각각 처리되도록 해야하나...?

export function addEvent(element, eventType, handler) {
    if (!events.has(element)) {
        events.set(element, new Map());
    }

    if (!events.get(element).has(eventType)) {
        events.get(element).set(eventType, handler);
    }
}

export function removeEvent(element, eventType, handler) {
    // handler변수 안쓰지만 테스트 코드 바꾸기 귀찮아서 로그로 사용
    console.log(handler);
    //root에 저장된 모든 이벤트 삭제
    events.forEach((element) => {
        element.forEach((eventType, handler) => {
            oldRoot.removeEventListener(handler, eventType);
        });
    });
    // Map에 저장된 해당 이벤트 삭제
    if (events.has(element) && events.get(element).has(eventType)) {
        events.get(element).delete(eventType);
        // 만약 삭제 후 해당 엘리먼트에 어떤 이벤트도 없으면 엘리먼트도 삭제
        if (events.get(element).size === 0) {
            events.delete(element);
        }

        // root에 이벤트 다시 등록
        events.forEach((element) => {
            element.forEach((eventType, handler) => {
                oldRoot.addEventListener(handler, eventType);
            });
        });
    }
}
