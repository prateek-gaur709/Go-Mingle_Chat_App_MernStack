import { CloseIcon } from '@chakra-ui/icons';
import { Badge } from '@chakra-ui/layout';

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <Badge
      borderRadius='lg'
      px={2}
      py={1}
      m={1}
      mb={2}
      variant='solid'
      fontSize={12}
      backgroundColor='purple'
      cursor='pointer'
      onClick={handleFunction}
    >
      {user.name}
      {admin === user._id && <span> (Admin)</span>}
      <CloseIcon pl={1} />
    </Badge>
  );
};

export default UserBadgeItem;
