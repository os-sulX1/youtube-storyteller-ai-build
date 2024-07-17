import type { Frame } from '@gptscript-ai/gptscript'
import React from 'react'

export default function renderEventMessage(event: Frame) {
  switch (event.type) {
    case 'runStart':
      return <div className="">Run Started at {event.start}</div>;

    case 'callStart':
      return (
        <div className="">
          <p>Tool Starting: {event.tool?.description}</p>
        </div>
      );

    case 'callChat':
      return (
        <div className="">
          Chat in progress with your input {'>>'}
          {String(event.input)}
        </div>
      );

    case 'callProgress':
      return null;

    case 'callFinish':
      return (
        <div className="">
          Call finished: {''}
          {Array.isArray(event.output) && event.output.map(output => (
            <div className="" key={output.content}>
              {output.content}
            </div>
          ))}
        </div>
      );

    case 'runFinish':
      return <div className="">Run finished at {event.end}</div>;

    case 'callSubCalls':
      return (
        <div className="">
          Sub-calls in progress:
          {Array.isArray(event.output) && event.output.map((output, index) => (
            <div className="" key={index}>
              <div className="">
                {output.content}
              </div>
              {output.subCalls &&
                Object.keys(output.subCalls).map(subCallKey => (
                  <div className="" key={subCallKey}>
                    <strong>SubCall {subCallKey}:</strong>
                    <div className="">Tool ID: {output.subCalls[subCallKey].toolID}</div>
                    <div className="">Input: {output.subCalls[subCallKey].input}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      );

    case 'callContinue':
      return (
        <div className="">
          Call continues:
          {Array.isArray(event.output) && event.output.map((output, index) => (
            <div className="" key={index}>
              <div className="">
                {output.content}
              </div>
              {output.subCalls &&
                Object.keys(output.subCalls).map(subCallKey => (
                  <div className="" key={subCallKey}>
                    <strong>SubCall {subCallKey}:</strong>
                    <div className="">Tool ID: {output.subCalls[subCallKey].toolID}</div>
                    <div className="">Input: {output.subCalls[subCallKey].input}</div>
                  </div>
                ))}
            </div>
          ))}
        </div>
      );

    default:
      return <pre>{JSON.stringify(event , null , 2)}</pre>;
  }
}
