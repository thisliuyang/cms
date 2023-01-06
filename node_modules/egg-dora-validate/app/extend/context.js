'use strict';

module.exports = {
  /**
   * validate data with rules
   *
   * @param  {Object} rules  - validate rule object, see [parameter](https://github.com/node-modules/parameter)
   * @param  {Object} [data] - validate target, default to `this.request.body`
   */
  validate(rules, data) {
    data = data || this.request.body;
    const errors = this.app.validator.validate(rules, data);
    if (errors) {

      let defaultNoticeStr = 'Validation Failed';
      if (errors.length > 0) {
        let firstErr = errors[0];
        if (rules[firstErr.field] && rules[firstErr.field].message) {
          defaultNoticeStr = firstErr.message = rules[firstErr.field].message;
        }
      }

      this.throw(422, defaultNoticeStr, {
        code: 'invalid_param',
        errors,
      });
    }
  },
};