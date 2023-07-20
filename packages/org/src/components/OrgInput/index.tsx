import {Input} from 'antd';
import React, {useState, useEffect} from 'react';
import {SearchProps} from "antd/lib/input";
import OrgModal from './modal';

export interface OrgInputProps extends SearchProps {
  searchApi: string
}

// extends base on Input.Search
const OrgInput: React.FC<OrgInputProps> = (props: OrgInputProps) => {
  const [value, setValue] = useState<string>('')
  const {searchApi, ...restProps} = props
  useEffect(() => {
    setValue(value || '')
  }, [value])
  const handleSearch = (value: string) => {
    setValue(value)
    console.log(value)
  }
  debugger;
  return (
    <>
      <Input.Search
        {...restProps}
        value={value}
        onSearch={handleSearch}
      />
      <OrgModal />
    </>
  )
}

export default OrgInput;
