import { reportMapper } from '../../../data/api-mapper';

export default class ReportDetailPresenter {
  #reportId;
  #view;
  #apiModel;
  #dbModel;

  constructor(reportId, { view, apiModel, dbModel }) {
    this.#reportId = reportId;
    this.#view = view;
    this.#apiModel = apiModel;
    this.#dbModel = dbModel;
  }

  async showReportDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportDetailMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async showReportDetail() {
    this.#view.showReportDetailLoading();
    try {
      const response = await this.#apiModel.getStoriesById(this.#reportId);

      if (!response.ok) {
        console.error('showReportDetail: response:', response);
        this.#view.populateReportDetailError(response.message);
        return;
      }

      console.log('raw story from API:', response.story);
      const report = await reportMapper(response.story);
      console.log('mapped report:', report);
      

      this.#view.populateReportDetailAndInitialMap(response.message, report);
    } catch (error) {
      console.error('showReportDetail: error:', error);
      this.#view.populateReportDetailError(error.message);
    } finally {
      this.#view.hideReportDetailLoading();
    }
  }

  // async getCommentsList() {
  //   this.#view.showCommentsLoading();
  //   try {
  //     const response = await this.#apiModel.getAllCommentsByReportId(this.#reportId);
  //     this.#view.populateReportDetailComments(response.message, response.data);
  //   } catch (error) {
  //     console.error('getCommentsList: error:', error);
  //     this.#view.populateCommentsListError(error.message);
  //   } finally {
  //     this.#view.hideCommentsLoading();
  //   }
  // }

  // async postNewComment({ body }) {
  //   this.#view.showSubmitLoadingButton();
  //   try {
  //     const response = await this.#apiModel.storeNewCommentByReportId(this.#reportId, { body });

  //     if (!response.ok) {
  //       console.error('postNewComment: response:', response);
  //       this.#view.postNewCommentFailed(response.message);
  //       return;
  //     }

  //     this.#view.postNewCommentSuccessfully(response.message, response.data);
  //   } catch (error) {
  //     console.error('postNewComment: error:', error);
  //     this.#view.postNewCommentFailed(error.message);
  //   } finally {
  //     this.#view.hideSubmitLoadingButton();
  //   }
  // }

async saveReport() {
  try {
    const response = await this.#apiModel.getStoriesById(this.#reportId);
    
    if (!response.ok) {
      throw new Error(response.message);
    }

    const mapped = await reportMapper(response.story);
    console.log('Saving mapped report to IndexedDB:', mapped);
    await this.#dbModel.putReport(mapped);
    this.#view.saveToBookmarkSuccessfully('Success to save to bookmark');
  } catch (error) {
    console.error('saveReport: error:', error);
    this.#view.saveToBookmarkFailed(error.message);
  }
}

  async removeReport() {
    try {
      await this.#dbModel.removeReport(this.#reportId);
      this.#view.removeFromBookmarkSuccessfully('Success to remove from bookmark');
    } catch (error) {
      console.error('removeReport: error:', error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isReportSaved()) {
      this.#view.renderRemoveButton();
      return;
    }
    this.#view.renderSaveButton();
  }
  async #isReportSaved() {
    return !!(await this.#dbModel.getStoriesById(this.#reportId));
  }
}
