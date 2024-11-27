export const AUTH_MESSAGE = {
  COMMON: {
    FORBIDDEN: '접근할 권한이 없습니다.',
    TOKEN: {
      UNAUTHORIZED: '토큰이 만료되지 않았습니다.',
      INVALID: '유효하지 않은 토큰입니다.',
    },
  },
  DTO: {
    PASSWORD_CHECK: {
      IS_NOT_EMPTY: '비밀번호를 다시 입력해주세요',
    },
  },
  SIGN_UP: {
    PASSWORD_CHECK: {
      NOT_MATCH: '비밀번호를 다시 확인해주세요',
    },
    EMAIL: {
      CONFLICT: '중복된 이메일입니다.',
    },
    NICKNAME: {
      CONFLICT: '중복된 닉네임입니다.',
    },
    FAVORITESUBJECT: {
      NOT_EMPTY: '좋아하는 과목을 입력해주세요.',
    },
    INTRODUCE: {
      NOT_EMPTY: '자기소개를 입력해주세요.',
      MIN_LENGTH: '자기소개는 10자 이상이어야 합니다.',
    },
  },
  VALIDATE_USER: {
    NOT_FOUND: '일치하는 사용자가 없습니다.',
    UNAUTHORIZED: '인증된 사용자가 아닙니다.',
  },
  SIGN_OUT: {
    NO_TOKEN: '이미 로그아웃 되었습니다.',
    SUCCEED: '로그아웃에 성공했습니다.',
  },
};
