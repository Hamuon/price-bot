import { Update, Start, Command, Ctx } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Update()
export class BotUpdate {
  constructor(private httpService: HttpService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply(
      'سلام! 👋\nبرای دریافت قیمت‌ها از این دستورات استفاده کن:\n\n' +
      '/dollar - قیمت دلار (USDT)\n' +
      '/gold - قیمت طلای ۱۸ عیار'
    );
  }

  @Command('dollar')
  async getDollar(@Ctx() ctx: Context) {
    try {
      const res$ = this.httpService.get('https://api.nobitex.ir/market/stats');
      const res = await lastValueFrom(res$);

      const usdtData = res.data?.stats?.['usdt-irt'];
      const price = usdtData?.latest;

      if (price) {
        await ctx.reply(`💵 قیمت لحظه‌ای دلار (تتر):\n${Number(price).toLocaleString()} تومان`);
      } else {
        throw new Error('No data');
      }
    } catch (err) {
      console.error(err);
      await ctx.reply('❌ خطا در دریافت قیمت دلار از نوبیتکس.');
    }
  }
  @Command('gold')
  async getGold(@Ctx() ctx: Context) {
    try {
      const res$ = this.httpService.get('https://api.tgju.org/v1/quote/instrument/gold_m');
      const res = await lastValueFrom(res$);

      const goldPrice = res.data?.data?.last?.value;

      if (goldPrice) {
        await ctx.reply(`🥇 قیمت طلای ۱۸ عیار:\n${goldPrice} ریال`);
      } else {
        throw new Error('No gold data');
      }
    } catch (err) {
      console.error(err);
      await ctx.reply('❌ خطا در دریافت قیمت طلا.');
    }
  }
}
