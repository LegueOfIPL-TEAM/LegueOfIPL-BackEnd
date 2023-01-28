import { applyDecorators, SetMetadata } from "@nestjs/common/decorators"

const SOMETHING = Symbol('SOMETHING')

function CustomDecorator(key: string | symbol) {
  // SetMetadata(SOMETHING, key)와 다른 데코레이터를 합성할 수 있습니다.
  return applyDecorators(SetMetadata(SOMETHING, key))
}

@CustomDecorator('KEY1')
class DecoratedClass {}