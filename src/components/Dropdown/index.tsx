import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

interface Option {
  value: string | number; // 실제 값
  label: string; // 보이는 값
  tag?: string;  // 추가 태그 (예: HD 표시)
}

interface DropdownProps {
  options: Option[]; // 옵션 배열
  defaultValue?: string | number | null; // 초기 값
  onChangeValue?: (value: Option) => void; // 값 변경 핸들러
  disabled?: boolean; // 비활성화 여부
  onChangeOpen?: (isOpen: boolean) => void; // 드롭다운 열림/닫힘 핸들러
}

const Dropdown = ({ options, defaultValue, onChangeValue, disabled, onChangeOpen }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | number>(defaultValue || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.value);
    setIsOpen(false);
    if (onChangeValue) {
      onChangeValue(option); // 변경 핸들러 호출
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (defaultValue) {
      setSelectedOption(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    if (onChangeOpen) {
      onChangeOpen(isOpen);
    }
  }, [isOpen])

  const selectedLabel = options.find(option => option.value === selectedOption)?.label || defaultValue;

  return (
    <DropdownContainer ref={dropdownRef} className='hogak-dropdown'>
      <DropdownButton onClick={toggleDropdown} disabled={disabled}>
        {selectedLabel}
      </DropdownButton>

      <DropdownList isOpen={isOpen}>
        {options.map((option, index) => (
          <DropdownItem
            key={index}
            isActive={option.value === selectedOption}
            onClick={() => handleOptionClick(option)}
          >
            <span>{option.label}</span>
            {option.tag && <TagLabel>{option.tag}</TagLabel>}
          </DropdownItem>
        ))}
      </DropdownList>
    </DropdownContainer>
  );
};

export default Dropdown;

// Styled Components
const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  padding: 0;
  background-color: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  text-align: center;
  font-size: 1.2em;
  line-height: 1.6em;
  white-space: nowrap;
`;

const DropdownList = styled.ul<{ isOpen: boolean }>`
  list-style: none;
  padding: 0.4em;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  border-radius: 6px;
  display: ${(props) => (props.isOpen ? "block" : "none")};
  min-width: 4em;
  max-height: 10em;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.3em;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #808080;
    border-radius: 0.4em;
  }
`;

const DropdownItem = styled.li<{ isActive: boolean }>`
  padding: 0.2em 0.4em;
  font-size: 1em;
  line-height: 1em;
  cursor: pointer;
  text-align: center;
  background-color: ${(props) => (props.isActive ? "#fff" : "transparent")};
  color: ${(props) => (props.isActive ? "#000" : "#fff")};
  border-radius: 4px;
  transition: background-color 0.2s, color 0.2s;
  sup {
    color: ${(props) => (props.isActive ? "#000" : "#fff")};
  }
  &:hover {
    background-color: ${(props) =>
      props.isActive ? "#fff" : "rgba(255,255,255,0.7)"};
    color: #000;
    sup {
      color: #000;
    }
  }
  &~li {
    margin-top: 0.4em;
  }
`;

const TagLabel = styled.sup`
  margin-left: 0.4em;
  font-size: 0.6em;
  color: #fff;
`;
