const Service = require("egg").Service;

class MyService extends Service {
  list() {
    const ctx = this.ctx;
    return ctx.model.Nav.findAll({});
  }

  async total() {
    var results = this.app.model.query(
      "select count(*) as total from tb_navs",
      {
        type: sequelize.QueryTypes.SELECT
      }
    );
    if (results.length) {
      return results[0].total;
    }
    return 0;
  }

  async store(nav) {
    console.log(nav);
    var nav0 = await this.ctx.model.Nav.findByPk(nav.key);
    if (!nav0) {
      return await this.ctx.model.Nav.create(nav);
    } else {
      return await nav0.update(nav);
    }
  }

  async remove(key) {
    var list = await this.ctx.model.Nav.findAll({
      where: {
        parent_key: key
      }
    });
    console.log(list);
    var nav0 = await this.ctx.model.Nav.findByPk(key);
    if (nav0) {
      nav0.destroy();

      // 递归删除
      for (let i = 0; i < list.length; i++) {
        await this.remove(list[i].key);
      }
      return true;
    }
    return false;
  }
}

module.exports = MyService;
