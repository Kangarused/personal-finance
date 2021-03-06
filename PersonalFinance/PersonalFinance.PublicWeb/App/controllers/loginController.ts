﻿module PersonalFinance.Controllers {
    export class LoginController {
        static $inject = ['$scope', '$state', '$validation', 'authService', 'userAccountService', 'messageService'];

        loginData: Models.ILoginRequest;
         
        constructor(
            private $scope: IScope,
            private $state: ng.ui.IStateService,
            private $validation,
            private authService: Services.IAuthService,
            private userAccountService: Services.IUserAccountService, 
            private messageService: Modules.MessageDisplay.IMessageService
        ) {
            $scope.vm = this;
        }

        login(form): void {
            this.messageService.clear();
            this.$validation.validate(form)
            .success(() => {
                this.userAccountService.getLocalToken(this.loginData.userName, this.loginData.password).then(
                (response) => {
                    this.authService.setAuthData(response.data);
                    this.redirectIfAuthorised();
                }, (error) => {
                    if (error.data.error == "invalid_grant") {
                        this.messageService.addError(error.data.error_description);
                    } else {
                        this.messageService.addError("Error performing user validation.");
                    }
                });
            });
        }

        redirectIfAuthorised(): void {
            if (this.authService.isUserAuth()) {
                this.$state.go("home.dashboard");
            }
        }
    }
}