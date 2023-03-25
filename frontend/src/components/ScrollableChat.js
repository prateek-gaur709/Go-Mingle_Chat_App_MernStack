import { Avatar, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from '../config/ChatLogics';
import { ChatState } from '../Context/ChatProvider';

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages[0] &&
        messages[0].map((m, i) => (
          <div style={{ display: 'flex' }} key={m._id}>
            {(isSameSender(messages[0], m, i, user._id) ||
              isLastMessage(messages[0], i, user._id)) && (
              <Tooltip label={m.sender.name} hasArrow placement='bottom-start'>
                <Avatar
                  size='sm'
                  mt='7px'
                  mr={1}
                  cursor='pointer'
                  src={m.sender.pic}
                  name={m.sender.name}
                />
              </Tooltip>
            )}

            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? '#BEE3F8' : '#B9F5D0'
                }`,
                padding: '5px 15px',
                maxWidth: '75%',
                borderRadius: '20px',
                marginLeft: isSameSenderMargin(messages[0], m, i, user._id),
                marginTop: isSameUser(messages[0], m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};
export default ScrollableChat;
