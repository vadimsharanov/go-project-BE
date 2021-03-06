import { UserModule } from "./user/user.module";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import config from "./ormconfig";
import { TagModule } from "./tag/tag.module";
import { AuthMiddleware } from "./user/middlewares/auth.middleware";
import { ArticleModule } from "./article/article.module";
import { ProfileModule } from "./profile/profile.module";
import { CommentModule } from "./comment/comment.module";
@Module({
	imports: [TypeOrmModule.forRoot(config), TagModule, UserModule, ArticleModule, ProfileModule, CommentModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(AuthMiddleware).forRoutes({
			path: "*",
			method: RequestMethod.ALL,
		});
	}
}
