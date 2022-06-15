import { Input, Modal } from "antd";
import { useState } from "react";
import React from 'react';

export default function ModalReviewBad ({isShow}){
    const [text, setText] = useState('');
  
    function encodeQueryString(params) {
        const keys = Object.keys(params)
        return keys.length
            ? "?" + keys
                .map(key => encodeURIComponent(key)
                    + "=" + encodeURIComponent(params[key]))
                .join("&")
            : ""
    }

    return <Modal
        title="Please tell us more details to make it better:"
        okText="Send"
        cancelText="Cancel"
        visible={isShow}
        onOk={() => {
            try {
                let url = "/api/save-setting";
            
                let parameters = {
                    key: "show_bad_review",
                    value: text
                };
                let parameters1 = {
                    key: "is_review",
                    value: 1
                };

                let parameters2 = {
                  key: "date_bad_review",
                  value: new Date().toDateString()
                };

                fetch(`${url}${encodeQueryString(parameters)}`)
                fetch(`${url}${encodeQueryString(parameters1)}`)
                fetch(`${url}${encodeQueryString(parameters2)}`)
            } catch (e) {
                console.log(e);
            }
            window.open("/", '_self')
        }}
        onCancel={() => {
            window.open("/", '_self')
        }}
    >
        <div>
            <Input.TextArea
                onChange={e => setText(e.target.value)}
                value={text}
            />
        </div>
    </Modal>;
  }

