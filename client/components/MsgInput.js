import { useRef } from "react"


// mutate라는 메서드 명의 이유는  
// 이 INPUT 창은 CREATE과 UPDATE의 역할을 한 예정이므로
// CREATE와 UPDATE의 의미를 모두 담기 위해서 MUTATE라는 네이밍 선택함
const MsgInput = ({mutate, text = '', id = undefined}) => {
    const textRef = useRef(text);

    const onSubmit = e => {
        e.preventDefault();
        e.stopPropagation();
        const text = textRef.current.value;
        textRef.current.value = '';
        mutate(text, id);
    }

    return (
        <form className="messages__input" onSubmit={onSubmit}>
            <textarea 
            ref={textRef}
            defaultValue={text}
            placeholder="내용을 입력하세요."
            />
            <button type="submit">완료</button>
        </form>
    )
}

export default MsgInput;
