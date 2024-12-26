import styled from "styled-components"

interface Props {
    message: string;
    style?:React.CSSProperties;
}

export const ToastPopup = ({message, style } :Props) => {
    return (
        <Toast style={style}>
            <Message>
                {message}
            </Message>
        </Toast>
    )
}

const Toast = styled.div`
    background: rgba(0,0,0,0.74);
    color: #fff;
    padding: 1em;
    width: 26em;
    max-width: 60%;
    border: 0.1em solid #333;
    border-radius: 2.4em;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    box-sizing: border-box; //241224 클립 추가
`
const Message = styled.div`
    font-size: 1.3em;
`