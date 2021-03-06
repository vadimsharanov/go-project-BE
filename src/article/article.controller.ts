import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common";
import { BackendValidationPipe } from "src/shared/pipes/backendValidation.pipe";
import { User } from "src/user/decorators/user.decorator";
import { UserEntity } from "src/user/entity/user.entity";
import { AuthGuard } from "src/user/guard/auth.guard";
import { ArticleEntity } from "./article.entity";
import { ArticleService } from "./article.service";
import { CreateArticleDto } from "./dto/createArticle.dto";
import { AllArticlesResponseInterface } from "./types/allArticlesResponseInterface";
import { ArticleResponseInterface } from "./types/article.response.interface";

@Controller("articles")
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Get()
	async findAll(@User("id") currentUserId: number, @Query() query: any): Promise<AllArticlesResponseInterface> {
		return await this.articleService.findAll(currentUserId, query);
	}

	@Get("feed")
	@UseGuards(AuthGuard)
	async getFeed(@User("id") currentUserId: number, @Query() query: any): Promise<AllArticlesResponseInterface> {
		return this.articleService.getFeed(currentUserId, query);
	}

	@Post()
	@UsePipes(new BackendValidationPipe())
	@UseGuards(AuthGuard)
	async create(
		@User() currentUser: UserEntity,
		@Body("article") createArticleDto: CreateArticleDto,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.createArticle(currentUser, createArticleDto);
		return this.articleService.buildArticleResponse(article);
	}
	@Get(":slug")
	async getArticle(@Param("slug") slug: string): Promise<ArticleResponseInterface> {
		const article = await this.articleService.findBySlug(slug);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(":slug")
	@UseGuards(AuthGuard)
	async deleteSingleArticle(@User("id") currentUserId: number, @Param("slug") slug: string) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}

	@Put(":slug")
	async updateSingleArticle(
		@User("id") currentUserId: number,
		@Body("article") createArticleDto: CreateArticleDto,
		@Param("slug") slug: string,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.updateArticle(currentUserId, createArticleDto, slug);
		return this.articleService.buildArticleResponse(article);
	}

	@Post(":slug/favorite")
	@UseGuards(AuthGuard)
	async addArticleToFavorites(
		@User("id") currentUserId: number,
		@Param("slug") slug: string,
	): Promise<ArticleResponseInterface> {
		const articles = await this.articleService.addArticleToFavorites(slug, currentUserId);
		return this.articleService.buildArticleResponse(articles);
	}

	@Delete(":slug/favorite")
	@UseGuards(AuthGuard)
	async deleteArticleFromFavorites(
		@User("id") currentUserId: number,
		@Param("slug") slug: string,
	): Promise<ArticleResponseInterface> {
		const articles = await this.articleService.deleteArticleFromFavorites(slug, currentUserId);
		return this.articleService.buildArticleResponse(articles);
	}
}
